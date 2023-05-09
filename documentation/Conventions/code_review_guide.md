# Code review guide

## 1 Code reviews should look at:

- Design: Is the code well-designed and appropriate for your system?
- Functionality: Does the code behave as the author likely intended? Is the way the code behaves good for its users?
- Complexity: Could the code be made simpler? Would another developer be able to easily understand and use this code when they come across it in the future?
- Tests: Does the code have correct and well-designed automated tests?
- Naming: Did the developer choose clear names for variables, classes, methods, etc.?
- Comments: Are the comments clear and useful?
- Style: Does the code follow our style guides?
- Documentation: Did the developer also update relevant documentation?

## 2 Picking the Best Reviewers
In general, you want to find the best reviewers you can who are capable of responding to your review within a reasonable period of time.

The best reviewer is the person who will be able to give you the most thorough and correct review for the piece of code you are writing. This usually means the owner(s) of the code, who may or may not be the people in the OWNERS file. Sometimes this means asking different people to review different parts of the CL.

## 3 Writing code review comments
- Be kind.
- Explain your reasoning.
- Balance giving explicit directions with just pointing out problems and letting the developer decide.
- Encourage developers to simplify code or add code comments instead of just explaining the complexity to you.

## Example review
- Design: Approved
- Functionality: Denied. You still need to impliment xx functionality
- Complexity: Approved
- Tests: Approved. No tests present but thats because only html was added
- Naming: Approved
- Comments: Approved
- Style: Approved
- Documentation: Approved. ADRS were updated

Obtained from https://google.github.io/eng-practices/review/