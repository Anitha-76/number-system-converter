// p5.js Number System Converter - Enhanced Interactive Version
let currentExample = 0;
let examples = [
    {fraction: "1/2", decimal: 0.5, whole: null, description: "Half a pizza", emoji: "🍕"},
    {fraction: "2/2", decimal: 1.0, whole: 1, description: "Two halves = One whole pizza", emoji: "🍕"},
    {fraction: "2/3", decimal: 0.667, whole: null, description: "Two thirds of a pizza", emoji: "🍕"},
    {fraction: "3/4", decimal: 0.75, whole: null, description: "Three quarters of a pizza", emoji: "🍕"},
    {fraction: "4/4", decimal: 1.0, whole: 1, description: "Four quarters = One whole pizza", emoji: "🍕"},
    {fraction: "3/5", decimal: 0.6, whole: null, description: "Three fifths of a pizza", emoji: "🍕"},
    {fraction: "5/5", decimal: 1.0, whole: 1, description: "Five fifths = One whole pizza", emoji: "🍕"},
    {fraction: "1/3", decimal: 0.333, whole: null, description: "One third of a pizza", emoji: "🍕"},
    {fraction: "4/6", decimal: 0.667, whole: null, description: "Four sixths of a pizza", emoji: "🍕"},
    {fraction: "6/6", decimal: 1.0, whole: 1, description: "Six sixths = One whole pizza", emoji: "🍕"}
];

// Animation variables
let animationPhase = 0;
let animationSpeed = 0.02;
let showConversion = false;
let transitionProgress = 0;
let isTransitioning = false;
let targetExample = 0;

// Particle system
let particles = [];
let confetti = [];

// Button hover states
let prevButtonHover = false;
let nextButtonHover = false;
let stepsButtonHover = false;

// Fraction bar animation
let fractionFillProgress = 0;

function setup() {
    // Make canvas tall enough for all content with generous spacing
    let canvas = createCanvas(windowWidth - 40, max(1700, windowHeight));
    canvas.parent('sketch-container');

    // Set a child-friendly font
    textFont('Comic Sans MS');

    // Initialize fraction fill
    fractionFillProgress = 0;
}

function draw() {
    // Dark themed background with subtle gradient
    drawBackground();

    // Update animations
    animationPhase += animationSpeed;

    // Handle example transitions
    if (isTransitioning) {
        transitionProgress += 0.05;
        if (transitionProgress >= 1) {
            transitionProgress = 0;
            isTransitioning = false;
            currentExample = targetExample;
            fractionFillProgress = 0;
        }
    } else {
        // Animate fraction fill
        if (fractionFillProgress < 1) {
            fractionFillProgress += 0.02;
        }
    }

    // Draw all components with improved spacing
    push();

    // Draw title with glow effect
    drawTitle();

    // Draw lesson objective
    drawLessonObjective();

    // Draw navigation controls at top
    drawNavigationControls();

    // Draw current example
    drawCurrentExample();

    // Draw pizza and fraction bar side-by-side
    drawPizzaAndFractionBar();

    // Draw decimal and whole number side by side
    drawNumberRepresentations();

    // Draw conversion steps if enabled
    if (showConversion) {
        drawConversionSteps();
    }

    pop();

    // Draw and update particles
    updateParticles();
    updateConfetti();

    // Draw interactive instructions
    drawInstructions();
}

function drawBackground() {
    // Animated dark background with warm tones
    let c1 = color(26, 10, 10);
    let c2 = color(44, 24, 16);
    let c3 = color(26, 10, 10);

    for (let y = 0; y < height; y += 2) {
        let inter = map(y, 0, height, 0, 1);
        let c;
        if (inter < 0.5) {
            c = lerpColor(c1, c2, inter * 2);
        } else {
            c = lerpColor(c2, c3, (inter - 0.5) * 2);
        }
        stroke(c);
        line(0, y, width, y);
    }

    // Add subtle floating particles
    noStroke();
    for (let i = 0; i < 20; i++) {
        let x = (frameCount * 0.5 + i * 100) % width;
        let y = (i * 37 + sin(frameCount * 0.01 + i) * 50) % height;
        fill(212, 165, 116, 20);
        circle(x, y, 3);
    }
}

function drawTitle() {
    // Glowing title box
    fill(44, 24, 16, 200);
    stroke(139, 69, 19);
    strokeWeight(3);

    let titleY = 20;
    let titleHeight = 100;

    // Add glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(212, 165, 116, 0.5)';

    rect(100, titleY, width - 200, titleHeight, 15);

    drawingContext.shadowBlur = 0;

    // Title text with pulsing effect
    let pulseSize = sin(animationPhase * 2) * 3;

    fill(212, 165, 116);
    textAlign(CENTER);
    textSize(48 + pulseSize);
    textStyle(BOLD);
    text("🔢 Number System Converter", width/2, titleY + 45);

    textSize(22);
    textStyle(NORMAL);
    fill(201, 182, 153);
    text("Learn about Fractions, Decimals, and Whole Numbers!", width/2, titleY + 80);
}

function drawLessonObjective() {
    let objY = 160;
    let objHeight = 110;

    // Objective box with warm colors
    fill(58, 32, 16, 180);
    stroke(139, 69, 19);
    strokeWeight(2);
    rect(100, objY, width - 200, objHeight, 10);

    fill(212, 165, 116);
    textAlign(CENTER);
    textSize(26);
    textStyle(BOLD);
    text("🎯 Learning Objective", width/2, objY + 35);

    textSize(18);
    textStyle(NORMAL);
    fill(201, 182, 153);
    text("Students will learn to identify and convert numbers between fractions, decimals, and whole numbers", width/2, objY + 58);
    text("and understand how these different representations show the same value!", width/2, objY + 78);
}

function drawNavigationControls() {
    let controlY = 320;
    let buttonWidth = 140;
    let buttonHeight = 70;
    let buttonSpacing = 25;

    // Center the control group
    let totalWidth = (buttonWidth * 3) + (buttonSpacing * 2);
    let startX = (width - totalWidth) / 2;

    // Example counter with glowing box - larger to prevent text overflow
    fill(44, 24, 16, 200);
    stroke(139, 69, 19);
    strokeWeight(2);
    rect(startX + buttonWidth + buttonSpacing - 20, controlY - 52, buttonWidth + 40, 40, 8);

    fill(255, 204, 128);
    textAlign(CENTER);
    textSize(22);
    textStyle(BOLD);
    text(`Example ${currentExample + 1} of ${examples.length}`, startX + buttonWidth + buttonSpacing + buttonWidth/2, controlY - 25);

    // Previous button
    let prevX = startX;
    let prevHover = mouseX >= prevX && mouseX <= prevX + buttonWidth &&
                    mouseY >= controlY && mouseY <= controlY + buttonHeight;

    drawButton(prevX, controlY, buttonWidth, buttonHeight, "◀ BACK",
               color(255, 150, 100), prevHover, currentExample > 0);

    // Next button
    let nextX = startX + buttonWidth + buttonSpacing;
    let nextHover = mouseX >= nextX && mouseX <= nextX + buttonWidth &&
                    mouseY >= controlY && mouseY <= controlY + buttonHeight;

    drawButton(nextX, controlY, buttonWidth, buttonHeight, "NEXT ▶",
               color(100, 200, 150), nextHover, currentExample < examples.length - 1);

    // Show Steps button
    let stepsX = startX + (buttonWidth + buttonSpacing) * 2;
    let stepsHover = mouseX >= stepsX && mouseX <= stepsX + buttonWidth &&
                     mouseY >= controlY && mouseY <= controlY + buttonHeight;

    drawButton(stepsX, controlY, buttonWidth, buttonHeight,
               showConversion ? "HIDE\nSTEPS" : "SHOW\nSTEPS",
               showConversion ? color(100, 150, 255) : color(150, 100, 255),
               stepsHover, true);
}

function drawButton(x, y, w, h, label, baseColor, isHover, isEnabled) {
    push();

    // Determine button appearance
    let fillColor = baseColor;
    let scale = 1;

    if (!isEnabled) {
        fillColor = color(60, 40, 30);
    } else if (isHover) {
        scale = 1.05;
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = 'rgba(255, 204, 128, 0.6)';
    }

    translate(x + w/2, y + h/2);
    scaleFn = scale;
    translate(-w/2, -h/2);

    // Button background
    fill(fillColor);
    stroke(isEnabled ? 139 : 80, 69, 19);
    strokeWeight(3);
    rect(0, 0, w, h, 10);

    drawingContext.shadowBlur = 0;

    // Button text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(18);
    textStyle(BOLD);

    if (label.includes('\n')) {
        let lines = label.split('\n');
        text(lines[0], w/2, h/2 - 10);
        text(lines[1], w/2, h/2 + 10);
    } else {
        text(label, w/2, h/2);
    }

    pop();
}

function drawCurrentExample() {
    let example = examples[currentExample];
    let exampleY = 430; // Reduced from 480 to bring it closer to navigation
    let boxHeight = 120;

    // Example box - just for description
    fill(58, 32, 16, 200);
    stroke(139, 69, 19);
    strokeWeight(3);

    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(212, 165, 116, 0.4)';

    rect(100, exampleY, width - 200, boxHeight, 12);

    drawingContext.shadowBlur = 0;

    // Description at top
    fill(212, 165, 116);
    textAlign(CENTER);
    textSize(32);
    textStyle(BOLD);
    text(example.description, width/2, exampleY + 35);

    // Subtitle explaining what we're showing
    fill(201, 182, 153);
    textSize(20);
    textStyle(NORMAL);
    text("See the pizza AND the fraction bar together!", width/2, exampleY + 75);
}

function drawPizzaAndFractionBar() {
    let example = examples[currentExample];
    let startY = 590; // Reduced from 650 to bring closer to description

    // Calculate layout dimensions
    let pizzaRadius = 85; // Slightly smaller
    let pizzaWidth = 380; // Left section width
    let containerWidth = width - 200;
    let barWidth = min(650, containerWidth - pizzaWidth - 100); // Ensure it fits in container
    let barHeight = 120; // Slightly reduced from 140

    // Calculate positions - centered within container
    let containerX = 100;
    let pizzaX = containerX + pizzaWidth/2;
    let pizzaY = startY + 115;

    let barX = pizzaX + pizzaWidth/2 + 30; // Reduced spacing from 50 to 30
    let barY = startY + 60;

    // Draw container box for entire section - adjusted height
    fill(58, 32, 16, 180);
    stroke(139, 69, 19);
    strokeWeight(3);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(212, 165, 116, 0.4)';
    rect(containerX, startY, containerWidth, 270, 12); // Reduced height from 280 to 270
    drawingContext.shadowBlur = 0;

    // Title above both
    fill(212, 165, 116);
    textAlign(CENTER);
    textSize(28);
    textStyle(BOLD);
    text("🍕 Visual Representations", width/2, startY + 30);

    // LEFT SIDE: Pizza visualization
    drawPizzaVisual(pizzaX, pizzaY, pizzaRadius, example);

    // RIGHT SIDE: Fraction bar
    drawFractionBarSection(barX, barY, barWidth, barHeight, example);
}

function drawPizzaVisual(x, y, radius, example) {
    // Draw a circular pizza divided into slices matching the fraction
    let parts = parseInt(example.fraction.split('/')[1]);
    let filled = parseInt(example.fraction.split('/')[0]);

    push();
    translate(x, y);

    // Draw each slice
    let anglePerSlice = TWO_PI / parts;

    for (let i = 0; i < parts; i++) {
        let startAngle = -HALF_PI + i * anglePerSlice;
        let endAngle = startAngle + anglePerSlice;

        // Determine if this slice should be filled
        let isFilled = i < filled;

        // Slice color - filled slices are orange/yellow, unfilled are gray
        if (isFilled) {
            let fillProgress = constrain((fractionFillProgress * filled) - i, 0, 1);
            fill(255, 180 + fillProgress * 50, 80, 200 * fillProgress);
        } else {
            fill(80, 60, 50, 150);
        }

        stroke(139, 69, 19);
        strokeWeight(3);

        // Draw the slice
        arc(0, 0, radius * 2, radius * 2, startAngle, endAngle, PIE);
    }

    // Draw center circle (pizza crust)
    fill(222, 184, 135);
    stroke(139, 69, 19);
    strokeWeight(2);
    circle(0, 0, 18);

    // Draw toppings on ALL slices - the entire pizza has toppings!
    // Define colorful topping types
    let toppingTypes = [
        { color: [180, 50, 50], size: 10 },      // Red pepperoni
        { color: [255, 200, 100], size: 8 },     // Yellow cheese bits
        { color: [100, 180, 100], size: 9 },     // Green peppers
        { color: [255, 140, 0], size: 7 },       // Orange peppers
        { color: [50, 50, 50], size: 7 }         // Black olives
    ];

    for (let i = 0; i < parts; i++) {
        let startAngle = -HALF_PI + i * anglePerSlice;
        let endAngle = startAngle + anglePerSlice;

        // Check if this slice is filled (highlighted)
        let isFilled = i < filled;

        // Use seeded random for consistent placement
        randomSeed(i * 1000 + currentExample);

        // Calculate number of toppings based on slice size
        let baseToppings = map(parts, 2, 20, 16, 4);
        let numToppings = int(random(baseToppings - 2, baseToppings + 2));

        for (let j = 0; j < numToppings; j++) {
            let r = random(radius * 0.3, radius * 0.85);
            let angleRange = endAngle - startAngle;
            let angle = startAngle + random(angleRange * 0.15, angleRange * 0.85);

            let px = cos(angle) * r;
            let py = sin(angle) * r;

            let toppingIndex = int(random(0, toppingTypes.length));
            let topping = toppingTypes[toppingIndex];
            let sizeVariation = random(-1, 1);

            // Dim the toppings on unfilled slices to show they're not selected
            let opacity = isFilled ? 255 : 80;
            fill(topping.color[0], topping.color[1], topping.color[2], opacity);
            noStroke();
            circle(px, py, topping.size + sizeVariation);

            // Add highlight only on filled slices
            if (isFilled) {
                fill(255, 255, 255, 100);
                circle(px - 1, py - 1, topping.size * 0.4);
            }
        }

        randomSeed(millis());
    }

    pop();

    // Label below pizza
    fill(255, 204, 128);
    textAlign(CENTER);
    textSize(20);
    textStyle(BOLD);
    text("Pizza Slices", x, y + radius + 25);

    fill(201, 182, 153);
    textSize(16);
    textStyle(NORMAL);
    text(`${filled} out of ${parts}`, x, y + radius + 48);
}

function drawFractionBarSection(barX, barY, barWidth, barHeight, example) {
    // Fraction bar container
    fill(30, 20, 15);
    stroke(139, 69, 19);
    strokeWeight(4);
    rect(barX, barY, barWidth, barHeight, 10);

    // Calculate fraction parts
    let parts = parseInt(example.fraction.split('/')[1]);
    let filled = parseInt(example.fraction.split('/')[0]);

    // Draw fraction parts with smooth animation
    let partWidth = barWidth / parts;
    for (let i = 0; i < parts; i++) {
        let fillAmount = constrain((fractionFillProgress * filled) - i, 0, 1);

        if (i < filled) {
            // Gradient fill for filled parts
            let gradient = drawingContext.createLinearGradient(
                barX + i * partWidth, barY,
                barX + i * partWidth, barY + barHeight
            );
            gradient.addColorStop(0, 'rgba(255, 204, 128, ' + (0.9 * fillAmount) + ')');
            gradient.addColorStop(1, 'rgba(255, 150, 80, ' + (0.9 * fillAmount) + ')');
            drawingContext.fillStyle = gradient;
        } else {
            fill(60, 40, 30, 150);
        }

        noStroke();
        rect(barX + i * partWidth + 2, barY + 2, partWidth - 4, barHeight - 4, 5);

        // Dividing lines
        stroke(139, 69, 19);
        strokeWeight(3);
        if (i > 0) {
            line(barX + i * partWidth, barY, barX + i * partWidth, barY + barHeight);
        }

        // Part numbers with better visibility
        fill(255, 204, 128);
        textAlign(CENTER, CENTER);
        textSize(20);
        textStyle(BOLD);
        text(i + 1, barX + i * partWidth + partWidth/2, barY + barHeight/2);
    }

    // Fraction label below bar
    fill(212, 165, 116);
    textAlign(CENTER);
    textSize(24);
    textStyle(BOLD);
    text(`Fraction: ${example.fraction}`, barX + barWidth/2, barY + barHeight + 35);

    // Explanation
    fill(201, 182, 153);
    textSize(16);
    textStyle(NORMAL);
    text(`💡 ${filled} out of ${parts} parts filled`, barX + barWidth/2, barY + barHeight + 60);

    // Special note for whole numbers
    if (example.whole !== null && filled === parts) {
        fill(255, 204, 128);
        textSize(14);
        text(`✨ All parts filled = 1 whole pizza!`, barX + barWidth/2, barY + barHeight + 80);
    }
}

function drawNumberRepresentations() {
    let example = examples[currentExample];
    let startY = 900; // Further reduced from 980 (pizza/bar section now ends around 860)
    let boxWidth = min(500, (width - 350) / 2);
    let boxHeight = 320;
    let spacing = 60;

    let leftX = width/2 - boxWidth - spacing/2;
    let rightX = width/2 + spacing/2;

    // Decimal representation (left)
    drawDecimalBox(leftX, startY, boxWidth, boxHeight, example);

    // Whole number representation (right)
    drawWholeNumberBox(rightX, startY, boxWidth, boxHeight, example);
}

function drawDecimalBox(x, y, w, h, example) {
    // Box background with green glow if it has decimals (not a whole number)
    let hasDecimals = example.whole === null;

    if (hasDecimals) {
        // Green glow for decimal numbers
        fill(100, 200, 100, 100);
        stroke(100, 255, 100);
        strokeWeight(3);

        // Add glow effect
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'rgba(100, 255, 100, 0.6)';
        rect(x, y, w, h, 12);
        drawingContext.shadowBlur = 0;
    } else {
        // Normal box for whole numbers
        fill(44, 24, 16, 200);
        stroke(139, 69, 19);
        strokeWeight(3);
        rect(x, y, w, h, 12);
    }

    // Title
    fill(hasDecimals ? 150 : 255, hasDecimals ? 255 : 150, 150);
    textAlign(CENTER);
    textSize(26);
    textStyle(BOLD);
    text("🔢 Decimal Form", x + w/2, y + 30);

    // Large decimal display
    fill(255, 204, 128);
    textSize(56);
    textStyle(BOLD);
    text(example.decimal, x + w/2, y + 85);

    // Place value breakdown
    let values = example.decimal.toString().split('.');
    let wholePart = values[0] || "0";
    let decimalPart = values[1] || "0";

    textSize(16);
    textStyle(NORMAL);
    fill(201, 182, 153);
    text("Place Values:", x + w/2, y + 120);

    // Mini place value boxes
    let numBoxes = 1 + Math.min(decimalPart.length, 3);
    let boxSize = 50;
    let totalBoxWidth = numBoxes * boxSize + (numBoxes - 1) * 5;
    let startBoxX = x + w/2 - totalBoxWidth/2;

    // Ones place
    fill(60, 40, 30);
    stroke(139, 69, 19);
    strokeWeight(2);
    rect(startBoxX, y + 135, boxSize, boxSize, 5);
    fill(255, 204, 128);
    textAlign(CENTER, CENTER);
    textSize(24);
    textStyle(BOLD);
    text(wholePart, startBoxX + boxSize/2, y + 135 + boxSize/2);

    fill(201, 182, 153);
    textSize(11);
    text("Ones", startBoxX + boxSize/2, y + 195);

    // Decimal places
    let places = ["Tenths", "Hundredths", "Thousandths"];
    for (let i = 0; i < Math.min(decimalPart.length, 3); i++) {
        let bx = startBoxX + (i + 1) * (boxSize + 5);

        fill(60, 40, 30);
        stroke(139, 69, 19);
        strokeWeight(2);
        rect(bx, y + 135, boxSize, boxSize, 5);

        fill(255, 204, 128);
        textSize(24);
        textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(decimalPart[i], bx + boxSize/2, y + 135 + boxSize/2);

        fill(201, 182, 153);
        textSize(11);
        text(places[i], bx + boxSize/2, y + 195);
    }

    // Conversion formula
    fill(58, 32, 16);
    stroke(139, 69, 19);
    strokeWeight(2);
    rect(x + 10, y + h - 55, w - 20, 45, 8);

    fill(255, 204, 128);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(NORMAL);
    let numerator = parseInt(example.fraction.split('/')[0]);
    let denominator = parseInt(example.fraction.split('/')[1]);
    text(`${example.fraction} = ${numerator} ÷ ${denominator} = ${example.decimal}`, x + w/2, y + h - 32);
}

function drawWholeNumberBox(x, y, w, h, example) {
    // Box background
    fill(44, 24, 16, 200);
    stroke(139, 69, 19);
    strokeWeight(3);
    rect(x, y, w, h, 12);

    // Title with color coding
    if (example.whole !== null) {
        fill(150, 255, 150); // Green for whole numbers
    } else {
        fill(255, 150, 150); // Red for non-whole numbers
    }
    textAlign(CENTER);
    textSize(26);
    textStyle(BOLD);
    text("🎯 Whole Number?", x + w/2, y + 30);

    if (example.whole !== null) {
        // YES - It's a whole number!
        fill(100, 200, 100, 100);
        stroke(100, 255, 100);
        strokeWeight(3);
        rect(x + w/2 - 100, y + 60, 200, 120, 12);

        // Celebration effect
        let sparkle = abs(sin(animationPhase * 4)) * 255;
        fill(255, 255, sparkle);
        textSize(50);
        text("✅", x + w/2, y + 95);

        fill(255, 204, 128);
        textSize(42);
        textStyle(BOLD);
        text(example.whole, x + w/2, y + 130);

        fill(150, 255, 150);
        textSize(16);
        text("Whole Number!", x + w/2, y + 155);

        // Explanation - better spacing
        fill(201, 182, 153);
        textSize(14);
        textStyle(NORMAL);
        text("✅ No decimal part", x + w/2, y + 200);
        text(`✅ Same as ${example.whole}/1`, x + w/2, y + 222);
        text("✅ Can count it!", x + w/2, y + 244);

    } else {
        // NO - Not a whole number - Red glow
        fill(200, 100, 100, 100);
        stroke(255, 100, 100);
        strokeWeight(3);

        // Add red glow effect
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'rgba(255, 100, 100, 0.6)';
        rect(x + w/2 - 100, y + 60, 200, 120, 12);
        drawingContext.shadowBlur = 0;

        fill(255, 100, 100);
        textSize(50);
        text("❌", x + w/2, y + 105);

        fill(255, 204, 128);
        textSize(16);
        textStyle(BOLD);
        text("Not a", x + w/2, y + 140);
        text("Whole Number", x + w/2, y + 160);

        // Explanation - better spacing
        fill(201, 182, 153);
        textSize(14);
        textStyle(NORMAL);
        text("❌ Has decimal part", x + w/2, y + 200);
        text("❌ Cannot be simplified", x + w/2, y + 222);
        text("to a whole number", x + w/2, y + 244);
    }
}

function drawConversionSteps() {
    let example = examples[currentExample];
    let stepsY = 1270; // Further adjusted from 1360 (decimal/whole boxes now end around 1220)
    let stepsHeight = 300;

    // Main background with animation
    fill(44, 24, 16, 220);
    stroke(139, 69, 19);
    strokeWeight(4);

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(212, 165, 116, 0.4)';

    rect(100, stepsY, width - 200, stepsHeight, 15);

    drawingContext.shadowBlur = 0;

    // Title
    fill(212, 165, 116);
    textAlign(CENTER);
    textSize(32);
    textStyle(BOLD);
    text("📚 Step-by-Step Conversion Guide", width/2, stepsY + 35);

    // Three-column layout for steps
    let colWidth = (width - 250) / 3;
    let col1X = 125;
    let col2X = col1X + colWidth + 10;
    let col3X = col2X + colWidth + 10;
    let stepY = stepsY + 70;

    let numerator = parseInt(example.fraction.split('/')[0]);
    let denominator = parseInt(example.fraction.split('/')[1]);

    // Step 1: Start with fraction
    drawStepBox(col1X, stepY, colWidth - 20, 180, "1️⃣", "Start with Fraction",
                [example.fraction, `${numerator} out of ${denominator}`, "parts"],
                color(255, 200, 200));

    // Step 2: Convert to decimal
    drawStepBox(col2X, stepY, colWidth - 20, 180, "2️⃣", "Divide to Get Decimal",
                [`${numerator} ÷ ${denominator}`, `= ${example.decimal}`, ""],
                color(200, 200, 255));

    // Step 3: Check if whole
    let step3Lines = example.whole !== null
        ? [`${example.decimal} = ${example.whole}`, "✅ Whole number!", ""]
        : [`${example.decimal}`, "❌ Not whole", "(has decimals)"];

    drawStepBox(col3X, stepY, colWidth - 20, 180, "3️⃣", "Check if Whole",
                step3Lines,
                example.whole !== null ? color(200, 255, 200) : color(255, 220, 200));
}

function drawStepBox(x, y, w, h, emoji, title, lines, accentColor) {
    // Step box background
    fill(58, 32, 16);
    stroke(139, 69, 19);
    strokeWeight(2);
    rect(x, y, w, h, 10);

    // Emoji
    textSize(40);
    textAlign(CENTER);
    text(emoji, x + w/2, y + 35);

    // Title
    fill(accentColor);
    textSize(18);
    textStyle(BOLD);
    text(title, x + w/2, y + 65);

    // Content lines
    fill(201, 182, 153);
    textSize(16);
    textStyle(NORMAL);
    for (let i = 0; i < lines.length; i++) {
        if (lines[i]) {
            text(lines[i], x + w/2, y + 95 + i * 25);
        }
    }
}

function drawInstructions() {
    // Floating instructions at bottom - fixed position
    fill(44, 24, 16, 200);
    stroke(139, 69, 19);
    strokeWeight(2);

    let instY = showConversion ? 1610 : 1270; // Adjusted from 1700:1360
    rect(100, instY, width - 200, 60, 10);

    fill(255, 204, 128);
    textAlign(CENTER, CENTER);
    textSize(20);
    textStyle(BOLD);
    text("🎮 Click buttons to navigate • ⌨️ SPACEBAR for next • 🔤 Press 'R' to reset", width/2, instY + 30);
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

function updateConfetti() {
    for (let i = confetti.length - 1; i >= 0; i--) {
        confetti[i].update();
        confetti[i].display();
        if (confetti[i].isDead()) {
            confetti.splice(i, 1);
        }
    }
}

function spawnParticles(x, y, count, symbols) {
    for (let i = 0; i < count; i++) {
        let symbol = symbols[floor(random(symbols.length))];
        particles.push(new Particle(x, y, symbol));
    }
}

function spawnConfetti(count) {
    for (let i = 0; i < count; i++) {
        confetti.push(new Confetti(random(width), -20));
    }
}

// Particle class
class Particle {
    constructor(x, y, symbol) {
        this.x = x;
        this.y = y;
        this.vx = random(-5, 5);
        this.vy = random(-10, -5);
        this.symbol = symbol;
        this.life = 255;
        this.size = random(20, 40);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // gravity
        this.life -= 5;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(frameCount * 0.1);
        fill(255, 204, 128, this.life);
        textSize(this.size);
        textAlign(CENTER, CENTER);
        text(this.symbol, 0, 0);
        pop();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Confetti class
class Confetti {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(2, 5);
        this.rotation = random(TWO_PI);
        this.rotationSpeed = random(-0.2, 0.2);
        this.life = 255;
        this.color = color(random(150, 255), random(150, 255), random(150, 255));
        this.size = random(8, 15);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.life -= 2;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation);
        fill(red(this.color), green(this.color), blue(this.color), this.life);
        noStroke();
        rect(-this.size/2, -this.size/2, this.size, this.size);
        pop();
    }

    isDead() {
        return this.life <= 0 || this.y > height;
    }
}

function mousePressed() {
    let controlY = 320;
    let buttonWidth = 140;
    let buttonHeight = 70;
    let buttonSpacing = 25;
    let totalWidth = (buttonWidth * 3) + (buttonSpacing * 2);
    let startX = (width - totalWidth) / 2;

    // Previous button
    if (mouseX >= startX && mouseX <= startX + buttonWidth &&
        mouseY >= controlY && mouseY <= controlY + buttonHeight) {
        if (currentExample > 0) {
            targetExample = currentExample - 1;
            isTransitioning = true;
        }
    }

    // Next button
    let nextX = startX + buttonWidth + buttonSpacing;
    if (mouseX >= nextX && mouseX <= nextX + buttonWidth &&
        mouseY >= controlY && mouseY <= controlY + buttonHeight) {
        if (currentExample < examples.length - 1) {
            targetExample = currentExample + 1;
            isTransitioning = true;
        }
    }

    // Show Steps button
    let stepsX = startX + (buttonWidth + buttonSpacing) * 2;
    if (mouseX >= stepsX && mouseX <= stepsX + buttonWidth &&
        mouseY >= controlY && mouseY <= controlY + buttonHeight) {
        showConversion = !showConversion;

        // Auto-scroll to steps when showing them
        if (showConversion) {
            setTimeout(() => {
                window.scrollTo({
                    top: 1400,
                    behavior: 'smooth'
                });
            }, 100);

            // Celebration if showing a whole number
            if (examples[currentExample].whole !== null) {
                spawnConfetti(30);
            }
        } else {
            // Scroll back to top when hiding steps
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
}

function keyPressed() {
    if (key === 'c' || key === 'C') {
        showConversion = !showConversion;

        // Auto-scroll to steps when showing them
        if (showConversion) {
            setTimeout(() => {
                window.scrollTo({
                    top: 1400,
                    behavior: 'smooth'
                });
            }, 100);

            if (examples[currentExample].whole !== null) {
                spawnConfetti(30);
            }
        } else {
            // Scroll back to top when hiding steps
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    if (key === ' ') {
        if (currentExample < examples.length - 1) {
            targetExample = currentExample + 1;
            isTransitioning = true;
        } else {
            targetExample = 0;
            isTransitioning = true;
        }
    }

    if (key === 'r' || key === 'R') {
        showConversion = false;
        currentExample = 0;
        targetExample = 0;
        fractionFillProgress = 0;
    }
}

function windowResized() {
    resizeCanvas(windowWidth - 40, windowHeight - 40);
}
