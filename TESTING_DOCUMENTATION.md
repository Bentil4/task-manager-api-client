# TESTING DOCUMENTATION

This document provides a complete overview of the testing strategy, implementation details, coverage results, challenges, and lessons learned during the development of the automated test suite for this project.

# 1. TESTING STRATEGY

## **Overall Approach**

The testing approach followed a layered methodology:

1. **Unit Testing**  
   Each class and utility function was independently tested in isolation using Jest.  
   This ensured that all components behaved correctly at the smallest level.

2. **Integration Testing**  
   Modules were tested together to validate real-world workflows such as:
   - API calls -> transforming data -> creating Task/User models -> grouping tasks
   - Multi‑step processes involving the APIClient and taskProcessor utilities

3. **Mocking Strategy**  
   External systems such as network requests were replaced with mock functions using:
   - `jest.fn()`
   - `mockResolvedValue()`
   - `mockRejectedValue()`  
     This ensured deterministic, repeatable tests.

4. **Spying Strategy**  
   `jest.spyOn()` was used to track internal function calls and console behavior.  
   This validated side‑effects (logging, array operations) and ensured correct method chaining.

5. **Error Handling Tests**  
   Robust error scenarios (invalid inputs, rejected Promises, missing fields) were tested to ensure graceful degradation.

## **Why This Strategy Was Chosen**

- Ensures **confidence** at every layer (unit -> integration -> workflow).
- Prevents regressions by isolating functionality.
- Mocks guarantee **test stability** (no network delays/failures).
- Spies verify internal logic without modifying behavior.
- High coverage improves maintainability and reliability.

# 2. TEST TYPES IMPLEMENTED

## **A. Unit Tests**

### **Classes Tested**

- **Task**
- **PriorityTask**
- **User**

### **Functions Tested**

- `filterByStatus()`
- `calculateStatistics()`
- `groupByUser()`
- Array helper behaviors (map/filter/reduce/sort)

### **Key Scenarios Covered**

- Constructor initialization
- Method behavior validation
- Edge cases (null, undefined, missing parameters)
- Error handling
- Status logic
- Date handling
- Side-effects (console calls)

### **Rationale**

Unit tests ensure each function behaves correctly or as expected before integrating with others.  
This results in cleaner debugging and easier long‑term maintenance.

## **B. Integration Tests**

### **Modules Interacting**

- `APIClient`
- `taskProcessor.js` utilities
- `Task` + `User` model classes
- Data transformations in workflows

### **Mocking Strategy**

- Mocked `fetch` globally
- Mock responses for users and todos
- Verified:
  - Correct URLs
  - Correct parameters
  - Correct response parsing

### **Workflows Tested**

1. Fetch users + todos -> Convert to model classes -> Group by user
2. Apply filters + statistics to transformed tasks
3. Multi‑user task distribution + completion rate calculation

### **Rationale**

Integration tests simulate real usage of the application and ensure the modules work **together** as intended.

---

## **C. Mocks & Spies**

### **Mocks Used**

- `tests/__mocks__/api.js` for APIClient mock
- `global.fetch` mock for API integrations
- Promise‑based mocks for success and failure scenarios

### **Spies Used**

- `console.log`, `console.warn`, `console.error`, `console.clear`, `console.table`
- Array method spies (`filter`, `map`, `sort`, `reduce`)
- Internal method call tracking (`toggle`, `getStatus`, `isOverDue`)

### **Justification for Mocking**

- Avoid real HTTP requests
- Ensure deterministic results
- Speed up test execution
- Allow controlled failure scenarios

---

# 3. TEST COVERAGE ANALYSIS

## **Coverage Summary**

![Coverage Summary](Coverage%20summary.png)

### **Coverage Interpretation**

- **Overall coverage exceeded required 80%**
- Unit tests achieved nearly full function and line coverage
- Integration tests significantly increased branch coverage

### **Areas Below 80%**

| File      | Reason                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `main.js` | CLI code with prompting, I/O, infinite loop. Not testable without heavy stubbing. Explicitly excluded from coverage. |

### **Actions Taken to Improve Coverage**

- Added tests for error-handling branches
- Spied on console methods to cover side-effect lines
- Tested cache logic inside the APIClient
- Added multiple workflows for deeper coverage

### **Intentionally Uncovered Code**

- `main.js` — excluded because it requires user input (readline), console output, and interactive loops.

---

# 4. CHALLENGES & SOLUTIONS

### **Challenge 1: Mocking fetch and API calls**

- **Problem**: Real network calls would break test consistency.
- **Solution**: Implemented a complete mock for `fetch` and used `mockResolvedValue()` and `mockRejectedValue()` for full control.

### **Challenge 2: Spying on console without polluting output**

- **Problem**: Logging caused noise during test execution.
- **Solution**: Used `jest.spyOn(console, "...").mockImplementation()` to suppress output while still validating behavior.

### **Challenge 3: Coverage drops from non-testable files**

- **Problem**: `main.js` dragged coverage to ~50%.
- **Solution**: Excluded file in Jest config and documented the reason (CLI code is non‑unit-testable).

---

# 5. KEY LEARNINGS

### Unit Testing

- Helps enforce predictable object behavior
- Makes debugging significantly easier
- Logical method grouping in `describe()` boosts readability
-

### Integration Testing

- Revealed subtle mismatches between API output and model expectations
- Ensures modules interact as a system, not just individually

### Mocking & Spying

- Mocks create stable, deterministic tests
- Spies ensure internal method call correctness
- Allows testing of console output and side‑effects safely

### Impact on Code Quality

- Tests enforced cleaner function design
- Encouraged better separation of logic
- Helped identify inconsistent naming (e.g., method names)

---

# 6. DIFFERENCES BETWEEN TEST TYPES

## **Unit Tests**

- Test smallest pieces or block of code in isolation
- No external dependencies
- Fast & deterministic
- Example :
  - Testing `Task.toggle()`
  - Testing `Task.isOverDue()`

## **Integration Tests**

- Test multiple modules working together
- Uses mocks but still performs multi-step workflows
- Example:
  - `APIClient.fetchTodos()` -> create Task models -> groupByUser()

## **End-to-End Tests **

- Simulate real user interactions
- Require test environments/browsers
- Example:
  - Running the CLI and selecting menu options

### **When to Use Each**

| Test Type   | When to Use                                               |
| ----------- | --------------------------------------------------------- |
| Unit        | Validating individual behaviors, input/output rules       |
| Integration | Verifying module interactions, workflows                  |
| E2E         | Validating real user experience across entire application |

---

``
