class TrieNode {
    constructor(value) {
        this.value = value;
        this.children = new Map();
        this.isEndOfWord = false;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.depth = 0;
        this.opacity = 0.2;
        this.highlighted = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode(null);
    }

    insert(word) {
        const cleanWord = word.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!cleanWord) return;

        let current = this.root;
        for (const char of cleanWord) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode(char));
            }
            current = current.children.get(char);
        }
        current.isEndOfWord = true;
    }

    calculateLayout(node, startAngle, endAngle, depth, config) {
        node.depth = depth;
        const radius = depth === 0 ? 0 : config.baseRadius + (depth * config.levelRadius);
        const midAngle = (startAngle + endAngle) / 2;
        node.angle = midAngle;
        node.x = config.centerX + radius * Math.cos(midAngle);
        node.y = config.centerY + radius * Math.sin(midAngle);

        if (node.children.size > 0) {
            const sectorSize = (endAngle - startAngle) / node.children.size;
            let currentStart = startAngle;
            const sortedChildren = Array.from(node.children.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(entry => entry[1]);

            sortedChildren.forEach((child) => {
                this.calculateLayout(child, currentStart, currentStart + sectorSize, depth + 1, config);
                currentStart += sectorSize;
            });
        }
    }
}

(function() {
    const canvas = document.getElementById('hero-canvas');
    const activeWordEl = document.getElementById('active-word');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const trie = new Trie();
    let dictionary = [];
    let dataLoaded = false;

    // Animation State
    let currentSearchPath = [];
    let searchIndex = 0;
    let searchWordIndex = 0;
    let frameCount = 0;
    let searchCooldown = 0;
    let animationFrameId;

    async function init() {
        try {
            const response = await fetch('cv.json');
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            
            const newDictionary = new Set();

            // 1. Flatten Skills
            if (data.skills) {
                data.skills.forEach(category => {
                    if (category.keywords) {
                        category.keywords.forEach(tech => newDictionary.add(tech));
                    }
                });
            }

            // 2. Flatten Project Tags
            if (data.projects) {
                data.projects.forEach(project => {
                    if (project.keywords) {
                        project.keywords.forEach(tag => newDictionary.add(tag));
                    }
                });
            }

            // 3. Extract Roles
            if (data.work) {
                data.work.forEach(exp => {
                    if (exp.position) newDictionary.add(exp.position);
                    if (exp.name && exp.name.split(' ').length === 1) newDictionary.add(exp.name);
                });
            }

            dictionary = Array.from(newDictionary);
            if (dictionary.length === 0) throw new Error("No keywords found");
            
            dictionary.forEach(word => trie.insert(word));
            dataLoaded = true;
            
            handleResize();
            render(0);

        } catch (error) {
            console.error("Failed to load CV data for Trie", error);
            const fallback = ["REACT", "TYPESCRIPT", "AWS", "GO", "NEXT.JS", "PYTHON", "DOCKER", "AZURE"];
            dictionary = fallback;
            fallback.forEach(word => trie.insert(word));
            dataLoaded = true;
            handleResize();
            render(0);
        }
    }

    function handleResize() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        const minDim = Math.min(canvas.width, canvas.height);
        trie.calculateLayout(trie.root, 0, Math.PI * 2, 0, {
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
            baseRadius: minDim * 0.05,
            levelRadius: minDim * 0.06
        });
    }

    window.addEventListener('resize', handleResize);

    function updateSimulation() {
        if (searchCooldown > 0) {
            searchCooldown--;
            return;
        }

        if (searchIndex === 0 && currentSearchPath.length === 0) {
            if (dictionary.length === 0) return;

            const rawWord = dictionary[searchWordIndex];
            const cleanWord = rawWord.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            if (activeWordEl) activeWordEl.textContent = `Scanning: ${rawWord}`;

            let node = trie.root;
            const path = [node];
            for (const char of cleanWord) {
                if (node.children.has(char)) {
                    node = node.children.get(char);
                    path.push(node);
                }
            }
            currentSearchPath = path;
            searchWordIndex = (searchWordIndex + 1) % dictionary.length;
        }

        if (frameCount % 8 === 0 && searchIndex < currentSearchPath.length) {
            const node = currentSearchPath[searchIndex];
            node.highlighted = true;
            searchIndex++;
        } else if (searchIndex >= currentSearchPath.length) {
            searchCooldown = 50;
            searchIndex = 0;
            currentSearchPath = [];
        }
        frameCount++;
    }

    function drawNode(node, time) {
        if (node.highlighted) {
            node.opacity = 1.0;
            node.highlighted = false;
        }
        node.opacity += (0.15 - node.opacity) * 0.05;

        const floatX = Math.sin(time * 0.0005 + node.depth) * 3;
        const floatY = Math.cos(time * 0.0005 + node.angle) * 3;
        const finalX = node.x + floatX;
        const finalY = node.y + floatY;

        node.children.forEach(child => {
            const childFloatX = Math.sin(time * 0.0005 + child.depth) * 3;
            const childFloatY = Math.cos(time * 0.0005 + child.angle) * 3;
            const childFinalX = child.x + childFloatX;
            const childFinalY = child.y + childFloatY;

            ctx.beginPath();
            ctx.moveTo(finalX, finalY);
            
            const cx = (finalX + childFinalX) / 2;
            const cy = (finalY + childFinalY) / 2;
            
            ctx.quadraticCurveTo(cx, cy, childFinalX, childFinalY);
            
            const edgeOpacity = Math.min(node.opacity, child.opacity) * 0.4;
            ctx.strokeStyle = `rgba(14, 165, 233, ${edgeOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            drawNode(child, time);
        });

        if (node.value) {
            ctx.beginPath();
            ctx.arc(finalX, finalY, 2 + (node.opacity * 4), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${node.opacity})`;
            ctx.fill();

            if (node.opacity > 0.25) {
                ctx.font = `bold ${10 + (node.opacity * 4)}px monospace`;
                ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity})`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(node.value, finalX, finalY);
            }
        }
    }

    function render(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateSimulation();
        drawNode(trie.root, time);
        animationFrameId = requestAnimationFrame(render);
    }

    init();
})();
