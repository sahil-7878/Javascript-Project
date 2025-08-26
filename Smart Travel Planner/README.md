# Smart Travel Planner

## Problem Definition

This project aims to solve a specific programming problem (please clarify or update this section with your exact problem statement). It uses JavaScript and HTML to provide an interactive, browser-based solution. The functionality and user interface are implemented in `index.html` and `script.js` files, respectively.

## Step-wise Explanation

1. **HTML Structure**
    - The `index.html` file defines the structure and layout of the user interface.
    - Elements such as buttons, inputs, and result display areas are included to facilitate user interaction.
2. **JavaScript Logic**
    - The `script.js` file handles all core computations, DOM manipulations, and user interactions.
    - Event listeners are attached to UI elements to trigger the required logic when a user performs actions.
    - The script processes input, performs calculations, and displays results dynamically within the HTML page.
3. **User Interaction**
    - The user enters data or interacts with UI elements.
    - The program responds in real-time, displaying outputs or feedback.

🧩 Project Flow
        🌍 Input Travel Destinations
        Ask the user to enter 3–5 destinations (store in an array).
        Use a for loop with prompt() for input.
        💰 Budget Check                                   
        Ask the user to input their total budget.
        If budget < ₹10,000 → "Plan a short domestic trip."
        If budget ₹10,000–₹50,000 → "You can plan a long domestic trip."
        If budget > ₹50,000 → "International trip possible!"
        🗓️ Number of Days Calculator
        Ask user for number of travel days.
        If days < 3 → "Weekend Getaway."
        If 3–7 days → "Perfect Holiday Trip."
        If > 7 days → "Extended Vacation."
        🛏️ Hotel Budget Suggestion (Function)
        Use a function to suggest hotel type:
        If budget/day < ₹2000 → "Budget Hotels."
        If ₹2000–₹5000 → "Mid-range Hotels."
        If > ₹5000 → "Luxury Hotels."
        ✅ Final Travel Summary
        Use template literals (ES6) to print:
        Destinations list
        Total Budget
        Days Planned
        Hotel Suggestion
        Trip Type



--------- Final Travel Summary ---------
Destinations: mumbai, pune, goa, manali
Total Budget: ₹25000
Days Planned: 10
Trip Type: Extended Vacation.
Hotel Suggestion: Mid-range Hotels.
Travel Summary: You can plan a long domestic trip.
