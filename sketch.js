let recognizing = false;
let recognition;
let detectedLanguage = "";
let flag = "";

const greetings = [];
const numGreetings = 15;

function setup() {
  createCanvas(1820, 810);
  textAlign(CENTER, CENTER);
  textSize(30);

  // Initialize greetings with random properties for scrolling effect
  for (let i = 0; i < numGreetings; i++) {
    greetings.push({
      text: random(["Hello", "Bonjour", "Hola", "Ciao", "Ni hao", "Namaste", "konnichiwa",
        "Xin chao", "Ahoj", "Kamusta","hei", "Marhaba","Buna","You alright","Howdy","Privet", "Namaskara", "Aloha"]),
      x: random(width),
      y: random(height),
      opacity: random(50, 100),
      size: random(25, 40),
      speed: random(0.2, 0.5)  // Slow downward speed
    });
  }

  // Initialize webkitSpeechRecognition if available
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      console.log("Transcribed Text: " + transcript);
      detectLanguage(transcript);
    };

    recognition.onend = function() {
      recognizing = false;
    };
  } else {
    alert("Web Speech API is not supported in this browser.");
  }

  // Create and style start button, positioned at the top center of the canvas
  const startButton = createButton("SPEAK");
  startButton.position(width / 2 - 90, 70);
  startButton.style('font-size', '20px');
  startButton.style('padding', '15px 30px');
  startButton.style('background-color', '#87CEEB');
  startButton.style('color', 'white');
  startButton.style('border', 'none');
  startButton.style('border-radius', '30px');
  startButton.style('cursor', 'pointer');
  startButton.style('transition', '0.3s');
  startButton.mousePressed(startRecognition);

  // Hover effect for button
  startButton.mouseOver(() => startButton.style('background-color', '#004D40'));
  startButton.mouseOut(() => startButton.style('background-color', '#00796B'));
}

function draw() {
  // Draw language script texture background
  drawLanguageScriptTexture();

  displayStatusBox();
  
  displayBottomStatusBar();
  
  fill('#333333');
  if (recognizing) {
    textSize(25);
    text("Listening...", width / 2, height / 2);
  } else if (detectedLanguage) {
    textSize(25);
    text(`Detected Language: ${detectedLanguage}`, width / 2, height / 2 - 20);
    textSize(40);
    text(flag, width / 2, height / 2 + 50);
  } else {
    textSize(20);
    text("Press the button to start", width / 2, height / 2);
  }
}

function startRecognition() {
  if (!recognizing) {
    recognizing = true;
    detectedLanguage = "";
    flag = "";
    recognition.start();
  }
}

async function detectLanguage(text) {
  try {
    const response = await fakeLanguageDetectionAPI(text);
    detectedLanguage = response.language;
    flag = response.flag;
  } catch (error) {
    console.error("Error detecting language:", error);
    detectedLanguage = "Error detecting language";
  }
}

// Function to create a slow language script texture background
function drawLanguageScriptTexture() {
  background('#E3F2FD');

  noStroke();
  for (let greeting of greetings) {
    fill(0, 0, 0, greeting.opacity); // Set text color and opacity
    textSize(greeting.size);         // Set text size
    text(greeting.text, greeting.x, greeting.y);

    // Update the position to create slow downward scrolling
    greeting.y += greeting.speed;

    // Reset position if it goes off-screen
    if (greeting.y > height) {
      greeting.y = -20; // Restart above the canvas
      greeting.x = random(width); // Random horizontal position
    }
  }
}

// Simulated language detection function (use actual API in a real app)
async function fakeLanguageDetectionAPI(text) {
  const languageData = {
    "hello": { language: "English", },
    "assalamu alaikum": { language: "Arabic Phrase", flag: " Peace Upon You" },
    "as-salamu alaikum": { language: "Arabic Phrase", flag: " Peace Upon You" },
    "assalamualaikum": { language: "Arabic Phrase", flag: " Peace Upon You" },
    "what's up": { language: "English", flag: "USA" },
    "howdy": { language: "English", flag: "Australia" },
    "you alright": { language: "English", flag: "United Kingdom" },
    "bonjour": { language: "French",  },
    "hola": { language: "Spanish",  },
    "ciao": { language: "Italian", },
    "ni hao": { language: "Chinese", },
    "namaste": { language: "Hindi",  },
    "kaise ho": { language: "Hindi",  },
    "bhalo": { language: "Bengali", },
    "tumi sundar": { language: "Bengali",  },
    "guten tag": { language: "German",  },
    "private": { language: "Russian",  },
    "konichiwa": { language: "Japanese", },
    "annyeong": { language: "Korean", },
    "janab": { language: "Pakistan", },
    "marhaba": { language: "Arabic", },
    "xin chao": { language: "Vietnamese",  },
    "hey": { language: "Swedish", },
    "sia": { language: "Hungarian",  },
    "yasu": { language: "Greek", },
    "ahoy": { language: "Czech",  },
    "kamusta": { language: "Filipino",  },
    "namaskara": { language: "Nepali",  },
    "buna": { language: "Romanian", },
    "aloha": { language: "Hawaiian",  },
  };

  const lowerText = text.toLowerCase();
  const detected = Object.keys(languageData).find(key => lowerText.includes(key));
  return detected ? languageData[detected] : { language: "Unknown", flag: "🌍" };
}

// Function to display a smaller rounded rectangle as a status box
function displayStatusBox() {
  noStroke();
  fill(255, 250, 250, 230);
  rectMode(CENTER);
  rect(width / 2, height / 2, 400, 200, 20);

  stroke('#B0BEC5');
  strokeWeight(3);
  noFill();
  rect(width / 2, height / 2, 400, 200, 20);
}

// Function to display a smaller bottom status bar saying "Hello Detector"
function displayBottomStatusBar() {
  noStroke();
  fill(255, 250, 250, 200);
  rectMode(CENTER);
  rect(width / 2, height - 40, 400, 40, 15);

  stroke('#B0BEC5');
  strokeWeight(2);
  noFill();
  rect(width / 2, height - 40, 400, 40, 15);

  fill('#333333');
  textSize(18);
  text("Language Detector", width / 2, height - 40);
}
