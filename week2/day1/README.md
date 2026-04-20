# Profile Card App

**Full Name:** [Your Full Name]

## Screenshot

![Profile Card App Screenshot](./screenshot.png)

## Conditional Rendering Explanation

In this project, conditional rendering is implemented in two places:

1. **Badge Component**: The 'Available for hire' badge only renders when the `isAvailable` prop is `true`. This is achieved using the logical AND operator (`&&`) which displays the badge only when the condition is met. If `isAvailable` is `false`, nothing is rendered in that part of the component.

2. **SkillsList Component**: When the skills array is empty, a "No items found" message is displayed instead of the skill tags. This uses a ternary operator (`skills.length > 0 ? show skills : show message`) to conditionally render different UI based on the data state.

Conditional rendering allows components to adapt their output based on props or state, creating dynamic and responsive user interfaces without needing to create multiple separate components.

## How to Run

```bash
npm install
npm run dev