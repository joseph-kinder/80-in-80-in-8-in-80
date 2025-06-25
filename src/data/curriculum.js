// 80-day curriculum for mastering the Optiver 80 in 8 challenge
// Based on Arthur Benjamin's mental math techniques

export const curriculum = {
  phases: [
    {
      name: "Phase 1: The Foundation",
      days: [1, 10],
      description: "Left-to-Right Arithmetic - Breaking old habits and building new ones"
    },
    {
      name: "Phase 2: Multiplication Mastery",
      days: [11, 35],
      description: "Building the Core Skill - The engine for most advanced calculations"
    },
    {
      name: "Phase 3: Division, Estimation & Paper Power",
      days: [36, 55],
      description: "Expanding the Toolkit - Building upon the multiplication base"
    },
    {
      name: "Phase 4: Specialized Skills",
      days: [56, 70],
      description: "The 'Mathemagician' Tricks - Calendar calculating and advanced techniques"
    },
    {
      name: "Phase 5: Integration and Speed",
      days: [71, 80],
      description: "Putting It All Together - Racing the clock to achieve 80 in 8"
    }
  ],
  
  // Daily tasks that must be completed every day
  dailyTasks: [
    {
      id: "warmup",
      name: "Mental Math Warmup",
      description: "20 basic calculations to activate your mind",
      type: "practice",
      count: 20,
      timeLimit: 120
    },
    {
      id: "technique-practice",
      name: "Today's Technique Practice",
      description: "Apply today's specific technique to 30 problems",
      type: "practice",
      count: 30,
      timeLimit: 300
    },
    {
      id: "speed-drill",
      name: "Mixed Speed Drill",
      description: "40 varied problems under time pressure",
      type: "timed",
      count: 40,
      timeLimit: 240
    },
    {
      id: "accuracy-check",
      name: "Perfect Accuracy Challenge",
      description: "20 problems aiming for 100% accuracy",
      type: "accuracy",
      count: 20,
      targetAccuracy: 100
    }
  ],
  
  days: [
    // PHASE 1: THE FOUNDATION (Days 1-10)
    {
      day: 1,
      title: "Mindset and Approach",
      locked: false,
      topics: [
        "Understanding the 'why' of mental math",
        "The core principle: calculate from left to right",
        "Breaking the right-to-left habit"
      ],
      lessons: {
        title: "The Mental Math Revolution",
        content: `Welcome to your journey to mental math mastery! Today, we're revolutionizing how you think about numbers.

**Why Left-to-Right?**
Traditional math teaches us to calculate from right to left, but this is unnatural for mental math. When you hear "five hundred twenty-three," you hear the hundreds first, not the ones!

**The Key Insight:**
By calculating left-to-right, you:
- Get immediate estimates
- Work with how your brain naturally processes numbers
- Can stop at any point with a reasonable approximation

**Example:** 523 + 246
- Traditional: Start with 3+6=9, carry the... wait, what were the other digits?
- Mental: 500+200=700, 20+40=60 (now 760), 3+6=9, total: 769

Practice saying numbers aloud as you calculate. This reinforces the left-to-right flow.`
      },
      exercises: [
        { type: "lesson", name: "Read about mental math benefits", id: "lesson1" },
        { type: "practice", name: "Simple left-to-right addition (no carrying)", count: 20, id: "ex1" },
        { type: "technique", name: "Practice saying numbers aloud while calculating", id: "ex2" }
      ],
      goals: ["Complete exercises with 100% accuracy", "Understand left-to-right principle"],
      minimumScore: 30
    },
    {
      day: 2,
      title: "Simple Left-to-Right Addition",
      locked: true,
      topics: [
        "Adding numbers without carrying",
        "Building left-to-right habits",
        "Immediate estimation benefits"
      ],
      lessons: {
        title: "Addition Without Tears",
        content: `Today we master simple addition using our new left-to-right approach.

**The Process:**
For 342 + 156 (no carrying needed):
1. Add hundreds: 300 + 100 = 400
2. Add tens: 40 + 50 = 90 (total: 490)
3. Add ones: 2 + 6 = 8 (total: 498)

**Key Technique:**
Always vocalize your running total: "400... 490... 498"

**Practice Tip:**
Start with 3-digit numbers where no column sums to 10 or more. This builds confidence before tackling carrying.`
      },
      exercises: [
        { type: "practice", name: "3-digit addition without carrying", count: 30, id: "ex1" },
        { type: "timed", name: "Speed test: simple additions", duration: 90, target: 15, id: "ex2" },
        { type: "technique", name: "Vocalize running totals", id: "ex3" }
      ],
      goals: ["Complete 15 additions in 90 seconds", "Smooth left-to-right processing"],
      minimumScore: 35
    },
    {
      day: 3,
      title: "2-Digit Addition Mastery",
      locked: true,
      topics: [
        "Adding 2-digit numbers efficiently",
        "Handling tens place first",
        "Building speed with smaller numbers"
      ],
      lessons: {
        title: "The 2-Digit Foundation",
        content: `Two-digit addition is the building block for all mental math. Master this, and everything else follows.

**The Method:**
For 47 + 38:
1. Add tens: 40 + 30 = 70
2. Add ones: 7 + 8 = 15
3. Combine: 70 + 15 = 85

**When Carrying is Needed:**
For 68 + 57:
1. Add tens: 60 + 50 = 110
2. Add ones: 8 + 7 = 15
3. Combine: 110 + 15 = 125

**Speed Secret:**
With practice, you'll see 47 + 38 and instantly think "70... 85" without conscious steps.`
      },
      exercises: [
        { type: "practice", name: "2-digit addition practice", count: 40, id: "ex1" },
        { type: "timed", name: "2-digit speed challenge", duration: 120, target: 30, id: "ex2" },
        { type: "accuracy", name: "Perfect 2-digit additions", count: 20, targetAccuracy: 100, id: "ex3" }
      ],
      goals: ["Average 4 seconds per 2-digit addition", "100% accuracy on final set"],
      minimumScore: 40
    },
    {
      day: 4,
      title: "The Subtraction Shortcut for Addition",
      locked: true,
      topics: [
        "Converting hard additions to easy subtractions",
        "Working with round numbers",
        "Mental flexibility"
      ],
      lessons: {
        title: "The Subtraction Trick",
        content: `Sometimes subtraction makes addition easier! This counterintuitive trick will save you time and effort.

**The Principle:**
When adding a number close to 100 (or any round number), add the round number and subtract the difference.

**Example 1:** 68 + 97
- Think: 68 + 100 - 3
- Calculate: 168 - 3 = 165

**Example 2:** 234 + 198
- Think: 234 + 200 - 2
- Calculate: 434 - 2 = 432

**When to Use:**
- Adding 96-99 → Add 100, subtract the difference
- Adding 196-199 → Add 200, subtract the difference
- Adding 47-49 → Add 50, subtract the difference

This technique is FUNDAMENTAL for speed. Master it completely!`
      },
      exercises: [
        { type: "practice", name: "Addition using subtraction trick", count: 30, id: "ex1" },
        { type: "practice", name: "Mixed regular and trick additions", count: 30, id: "ex2" },
        { type: "technique", name: "Identify when to use the trick", id: "ex3" }
      ],
      goals: ["Master the subtraction shortcut", "Recognize when to apply it instantly"],
      minimumScore: 40
    },
    {
      day: 5,
      title: "3-Digit Addition Excellence",
      locked: true,
      topics: [
        "Extending left-to-right to larger numbers",
        "Managing working memory",
        "Building towards test-level problems"
      ],
      lessons: {
        title: "Scaling Up to 3 Digits",
        content: `Three-digit addition tests your working memory. The key is maintaining your running total clearly.

**Standard Approach:**
For 567 + 289:
1. 500 + 200 = 700
2. 60 + 80 = 140, so 700 + 140 = 840
3. 7 + 9 = 16, so 840 + 16 = 856

**Using the Subtraction Trick:**
For 567 + 298:
1. 567 + 300 = 867
2. 867 - 2 = 865

**Memory Technique:**
Always state your running total aloud or mentally: "700... 840... 856"

**Common Pitfall:**
Don't lose track of your hundreds when adding tens. If needed, repeat: "Eight hundred... eight hundred forty..."
`
      },
      exercises: [
        { type: "practice", name: "3-digit addition marathon", count: 40, id: "ex1" },
        { type: "mixed", name: "Combined 2 and 3-digit problems", count: 30, id: "ex2" },
        { type: "mock", name: "Mini mock test - addition only", questions: 20, duration: 180, id: "ex3" }
      ],
      goals: ["90% accuracy on 3-digit additions", "Complete mini mock in under 3 minutes"],
      minimumScore: 45
    },    {
      day: 6,
      title: "Left-to-Right Subtraction",
      locked: true,
      topics: [
        "Applying left-to-right to subtraction",
        "Subtracting in chunks",
        "Maintaining mental clarity"
      ],
      lessons: {
        title: "Subtraction Revolution",
        content: `Just like addition, subtraction becomes easier when done left-to-right.

**The Method:**
For 74 - 29:
1. Subtract tens: 74 - 20 = 54
2. Subtract ones: 54 - 9 = 45

**Handling Borrowing:**
For 83 - 47:
1. 83 - 40 = 43
2. 43 - 7 = 36

**Mental Model:**
Think of subtraction as "taking away chunks" rather than digit-by-digit borrowing.

**Advanced Example:**
456 - 178:
1. 456 - 100 = 356
2. 356 - 70 = 286
3. 286 - 8 = 278`
      },
      exercises: [
        { type: "practice", name: "2-digit subtraction practice", count: 30, id: "ex1" },
        { type: "practice", name: "3-digit subtraction practice", count: 20, id: "ex2" },
        { type: "timed", name: "Subtraction speed test", duration: 120, target: 25, id: "ex3" }
      ],
      goals: ["Complete all subtractions in under 2 minutes", "Master left-to-right subtraction"],
      minimumScore: 45
    },
    {
      day: 7,
      title: "The Addition Shortcut for Subtraction",
      locked: true,
      topics: [
        "Converting hard subtractions to easy additions",
        "Round number strategies",
        "Mental math flexibility"
      ],
      lessons: {
        title: "The Addition Trick for Subtraction",
        content: `Just as we used subtraction to help with addition, we can use addition to simplify subtraction!

**The Principle:**
When subtracting a number close to a round number, subtract the round number and add back the difference.

**Example 1:** 121 - 97
- Think: 121 - 100 + 3
- Calculate: 21 + 3 = 24

**Example 2:** 345 - 198
- Think: 345 - 200 + 2
- Calculate: 145 + 2 = 147

**Why It Works:**
Subtracting 100 is instant. Adding small numbers is easy. Combined, they're faster than traditional borrowing.

**Pattern Recognition:**
- Subtracting 96-99 → Subtract 100, add back the difference
- Subtracting 196-199 → Subtract 200, add back the difference`
      },
      exercises: [
        { type: "practice", name: "Subtraction using addition trick", count: 30, id: "ex1" },
        { type: "comparison", name: "Solve both ways and compare speed", count: 20, id: "ex2" },
        { type: "mixed", name: "Mixed subtraction strategies", count: 30, id: "ex3" }
      ],
      goals: ["Master the addition shortcut for subtraction", "Automatically recognize when to use it"],
      minimumScore: 45
    },
    {
      day: 8,
      title: "2-Digit Complements Mastery",
      locked: true,
      topics: [
        "Understanding complements to 100",
        "The 9s and 10s rule",
        "Making subtraction effortless"
      ],
      lessons: {
        title: "The Magic of Complements",
        content: `Complements are number pairs that sum to 100 (or 1000). They're the secret weapon for lightning-fast subtraction.

**The Rule for 2-Digit Complements:**
- First digit: What adds to 9?
- Second digit: What adds to 10?

**Examples:**
- Complement of 75: First digit 7→2 (makes 9), Second digit 5→5 (makes 10) = 25
- Complement of 43: First digit 4→5, Second digit 3→7 = 57
- Complement of 91: First digit 9→0, Second digit 1→9 = 09 (or just 9)

**Using for Subtraction:**
100 - 64 = 36 (instant if you know 64's complement)

**Practice Tip:**
Complements should become reflexive. See 73, think 27. No calculation needed!`
      },
      exercises: [
        { type: "practice", name: "Find 2-digit complements", count: 40, id: "ex1" },
        { type: "practice", name: "Subtract from 100 using complements", count: 30, id: "ex2" },
        { type: "timed", name: "Complement speed drill", duration: 60, target: 30, id: "ex3" }
      ],
      goals: ["Find any 2-digit complement in under 2 seconds", "Complete 30 complements in 60 seconds"],
      minimumScore: 50
    },
    {
      day: 9,
      title: "3-Digit Complements & Making Change",
      locked: true,
      topics: [
        "Extending complements to 1000",
        "Real-world application: making change",
        "Building mental reflexes"
      ],
      lessons: {
        title: "Advanced Complements",
        content: `Three-digit complements follow the same pattern, extended to 1000.

**The Rule for 3-Digit Complements:**
- First digit: What adds to 9?
- Second digit: What adds to 9?
- Third digit: What adds to 10?

**Examples:**
- Complement of 256: 2→7, 5→4, 6→4 = 744
- Complement of 831: 8→1, 3→6, 1→9 = 169

**Making Change:**
This is complements in action!
- Change from $10 for $3.67: Complement of 367 = 633, so $6.33
- Change from $20 for $13.45: Think $20 - $13.45 = $6.55

**Mental Shortcut:**
For amounts like $7.83, think: "17 cents to $8, then $2 to $10" = $2.17`
      },
      exercises: [
        { type: "practice", name: "Find 3-digit complements", count: 30, id: "ex1" },
        { type: "practice", name: "Make change from $10, $20, $100", count: 30, id: "ex2" },
        { type: "real-world", name: "Shopping scenarios with change", count: 20, id: "ex3" }
      ],
      goals: ["Master 3-digit complements", "Make change instantly for any amount"],
      minimumScore: 50
    },
    {
      day: 10,
      title: "Phase 1 Review & Assessment",
      locked: true,
      topics: [
        "Consolidating all addition/subtraction skills",
        "Testing under pressure",
        "Identifying remaining weaknesses"
      ],
      lessons: {
        title: "Foundation Complete!",
        content: `Congratulations! You've rebuilt your mathematical foundation. Let's review what you've learned:

**Your New Skills:**
1. Left-to-right calculation (natural and fast)
2. The subtraction trick for addition
3. The addition trick for subtraction
4. Instant complements
5. Making change

**Today's Challenge:**
Complete a 40-problem mixed test:
- 10 simple additions
- 10 additions using the subtraction trick
- 10 subtractions using complements
- 10 making change problems

**Success Criteria:**
- 95% accuracy minimum
- Complete in under 5 minutes
- Feel confident and automatic

Ready for Phase 2: Multiplication Mastery!`
      },
      exercises: [
        { type: "review", name: "Practice weak areas from days 1-9", count: 30, id: "ex1" },
        { type: "mock", name: "Phase 1 Final Test", questions: 40, duration: 300, id: "ex2" },
        { type: "reflection", name: "Identify your strongest and weakest skills", id: "ex3" }
      ],
      goals: ["Score 38+/40 on final test", "Complete test in under 5 minutes", "Feel ready for multiplication"],
      minimumScore: 55
    },
    
    // PHASE 2: MULTIPLICATION MASTERY (Days 11-35)
    {
      day: 11,
      title: "2-by-1 Multiplication: The Addition Method",
      locked: true,
      topics: [
        "Breaking down 2-digit × 1-digit multiplication",
        "Using the distributive property",
        "Left-to-right multiplication"
      ],
      lessons: {
        title: "The Building Block of All Multiplication",
        content: `Two-by-one multiplication is the foundation for all mental multiplication. Master this, and you can multiply anything.

**The Addition Method:**
For 53 × 6:
1. Break it down: (50 × 6) + (3 × 6)
2. Calculate: 300 + 18
3. Result: 318

**Always Left-to-Right:**
This maintains our consistent approach and gives immediate estimates.

**More Examples:**
- 47 × 8 = (40 × 8) + (7 × 8) = 320 + 56 = 376
- 63 × 7 = (60 × 7) + (3 × 7) = 420 + 21 = 441

**Pro Tip:**
Say the running total aloud: "420... 441"

**Common Mistake:**
Don't forget to add both parts! It's easy to stop at 420 and forget the 21.`
      },
      exercises: [
        { type: "practice", name: "2×1 multiplication basics", count: 30, id: "ex1" },
        { type: "practice", name: "2×1 with larger digits", count: 30, id: "ex2" },
        { type: "timed", name: "2×1 speed challenge", duration: 180, target: 25, id: "ex3" }
      ],
      goals: ["Master the addition method", "Average 8-10 seconds per problem"],
      minimumScore: 55
    },
    {
      day: 12,
      title: "2-by-1 Multiplication: Building Speed",
      locked: true,
      topics: [
        "Increasing calculation speed",
        "Pattern recognition",
        "Automatic processing"
      ],
      lessons: {
        title: "From Conscious to Automatic",
        content: `Yesterday you learned the method. Today we build speed through pattern recognition.

**Speed Techniques:**

1. **Multiples of 10 are instant:**
   - 70 × 8 = 560 (just add a zero to 7 × 8)

2. **Common patterns to memorize:**
   - 25 × 4 = 100
   - 25 × 8 = 200
   - 75 × 4 = 300

3. **The 5 trick:**
   - Any number × 5 = half the number × 10
   - 46 × 5 = 23 × 10 = 230

**Today's Focus:**
Build automatic recognition. See 43 × 7 and immediately think "280... 301" without conscious calculation.`
      },
      exercises: [
        { type: "practice", name: "2×1 pattern recognition", count: 40, id: "ex1" },
        { type: "timed", name: "Beat yesterday's time", duration: 180, target: 30, id: "ex2" },
        { type: "endurance", name: "100 problems accuracy test", count: 100, id: "ex3" }
      ],
      goals: ["Improve speed by 20% from yesterday", "Maintain 95%+ accuracy"],
      minimumScore: 58
    },    // ... More days to be added with detailed lessons
    // For now, let's create a generator function for the remaining days
  ]
};

// Generate remaining days with progressive difficulty and lessons
export function generateFullCurriculum() {
  const fullDays = [...curriculum.days];
  
  // Add remaining Phase 2 days (13-35)
  const phase2Days = [
    {
      day: 13,
      title: "2-by-1: The Subtraction Method",
      topics: ["Using subtraction for 8s and 9s", "Choosing the easier path", "Mental flexibility"],
      minimumScore: 58
    },
    {
      day: 14,
      title: "3-by-1 Multiplication Basics",
      topics: ["Extending to 3-digit numbers", "Managing working memory", "Saying the running total"],
      minimumScore: 60
    },
    {
      day: 15,
      title: "3-by-1 Multiplication Practice",
      topics: ["Building endurance", "Accuracy with larger numbers", "Speed development"],
      minimumScore: 60
    },
    // Days 16-35 continue building multiplication skills
  ];
  
  // Add remaining Phase 3 days (36-55)
  const phase3Days = [
    {
      day: 36,
      title: "Mental Division: 1-Digit Divisors",
      topics: ["Division as reverse multiplication", "Estimating quotients", "Handling remainders"],
      minimumScore: 65
    },
    // Days 37-55 continue with division and estimation
  ];
  
  // Add remaining Phase 4 days (56-70)
  const phase4Days = [
    {
      day: 56,
      title: "The Phonetic Code",
      topics: ["Major System introduction", "Converting numbers to words", "Memory techniques"],
      minimumScore: 70
    },
    // Days 57-70 continue with specialized skills
  ];
  
  // Add remaining Phase 5 days (71-80)
  const phase5Days = [
    {
      day: 71,
      title: "Math of Least Resistance",
      topics: ["Choosing optimal strategies", "Pattern recognition", "Strategic thinking"],
      minimumScore: 75
    },
    {
      day: 80,
      title: "Final Test & Celebration",
      topics: ["Complete 80 in 8 challenge", "Reflection on progress", "Next steps"],
      minimumScore: 80
    }
  ];
  
  // For now, fill in the gaps with structured practice days
  for (let i = 13; i <= 35; i++) {
    if (!fullDays.find(d => d.day === i)) {
      fullDays.push({
        day: i,
        title: `Day ${i}: Multiplication Training`,
        locked: true,
        topics: ["Progressive multiplication practice", "Speed building", "Accuracy focus"],
        lessons: {
          title: "Building Multiplication Mastery",
          content: "Continue practicing the techniques from previous days. Focus on smooth, automatic calculation."
        },
        exercises: [
          { type: "practice", name: "Multiplication practice", count: 50, id: "ex1" },
          { type: "timed", name: "Speed test", duration: 180, target: 30 + Math.floor((i - 13) / 2), id: "ex2" },
          { type: "accuracy", name: "Perfect calculations", count: 20, targetAccuracy: 95, id: "ex3" }
        ],
        goals: [`Score ${55 + Math.floor((i - 13) / 2)}+ in exercises`],
        minimumScore: 55 + Math.floor((i - 13) / 3)
      });
    }
  }
  
  // Fill Phase 3
  for (let i = 36; i <= 55; i++) {
    if (!fullDays.find(d => d.day === i)) {
      fullDays.push({
        day: i,
        title: `Day ${i}: Division & Estimation`,
        locked: true,
        topics: ["Division techniques", "Estimation skills", "Mixed operations"],
        lessons: {
          title: "Expanding Your Toolkit",
          content: "Practice division and estimation techniques. These skills complement your multiplication mastery."
        },
        exercises: [
          { type: "practice", name: "Division practice", count: 30, id: "ex1" },
          { type: "practice", name: "Estimation exercises", count: 20, id: "ex2" },
          { type: "mixed", name: "All operations mixed", count: 40, id: "ex3" }
        ],
        goals: [`Achieve ${65 + Math.floor((i - 36) / 3)}+ score`],
        minimumScore: 65 + Math.floor((i - 36) / 4)
      });
    }
  }
  
  // Fill Phase 4
  for (let i = 56; i <= 70; i++) {
    if (!fullDays.find(d => d.day === i)) {
      fullDays.push({
        day: i,
        title: `Day ${i}: Advanced Techniques`,
        locked: true,
        topics: ["Memory techniques", "Calendar calculations", "Advanced multiplication"],
        lessons: {
          title: "Becoming a Mathemagician",
          content: "Learn impressive mental math techniques that showcase your skills."
        },
        exercises: [
          { type: "practice", name: "Advanced problems", count: 40, id: "ex1" },
          { type: "technique", name: "Special methods practice", id: "ex2" },
          { type: "mock", name: "Mini test", questions: 40, duration: 300, id: "ex3" }
        ],
        goals: [`Score ${70 + Math.floor((i - 56) / 3)}+`],
        minimumScore: 70 + Math.floor((i - 56) / 4)
      });
    }
  }
  
  // Fill Phase 5
  for (let i = 71; i <= 80; i++) {
    if (!fullDays.find(d => d.day === i)) {
      fullDays.push({
        day: i,
        title: `Day ${i}: Speed Integration`,
        locked: true,
        topics: ["Full test preparation", "Speed optimization", "Consistency"],
        lessons: {
          title: "The Final Push",
          content: "You're in the final stretch! Focus on speed while maintaining accuracy. The 80 in 8 goal is within reach."
        },
        exercises: [
          { type: "mock", name: "Full 80-question test", questions: 80, duration: 480, id: "ex1" },
          { type: "practice", name: "Weak area drill", count: 40, id: "ex2" },
          { type: "speed", name: "Lightning round", count: 50, duration: 200, id: "ex3" }
        ],
        goals: [`Complete 80 questions in ${8 + (80 - i) / 2} minutes`, `Score ${75 + (i - 71) / 2}+`],
        minimumScore: 75 + Math.floor((i - 71) / 3)
      });
    }
  }
  
  // Sort days by day number
  fullDays.sort((a, b) => a.day - b.day);
  
  return { ...curriculum, days: fullDays };
}

// Check if a day is unlocked based on progress
export function isDayUnlocked(day, progress, user) {
  if (day === 1) return true; // First day is always unlocked
  
  const previousDay = day - 1;
  const previousDayProgress = progress[previousDay];
  
  if (!previousDayProgress || !previousDayProgress.completed) {
    return false;
  }
  
  // Check if all daily tasks were completed
  if (!previousDayProgress.dailyTasksCompleted) {
    return false;
  }
  
  // Check if minimum score was achieved
  const curriculum = generateFullCurriculum();
  const previousDayData = curriculum.days.find(d => d.day === previousDay);
  if (previousDayData && previousDayData.minimumScore) {
    if (!previousDayProgress.score || previousDayProgress.score < previousDayData.minimumScore) {
      return false;
    }
  }
  
  return true;
}

// Get lesson content for a specific day
export function getLessonForDay(day) {
  const curriculum = generateFullCurriculum();
  const dayData = curriculum.days.find(d => d.day === day);
  return dayData?.lessons || null;
}