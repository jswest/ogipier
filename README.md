# Ogipier

_It's pierogi, but reversed (sort of)..._

I don't know why I made a Reverse Polish Notation language, but I did. It compiles to JavaScript so that it can—someday, maybe—be used on the web.

## See how it works.

Here is a basic "hello world" program:

```ogipier
"Hello, World!" PRINT
```

Here you can get the meaning of life:

```ogipier
21 21 ADD PRINT
```

Here's the fibonacci sequence to 20 digits:

```ogipier
20 TIMES
	0 INDEX 0 == IF
		0 DUPLICATE PRINT
		1 DUPLICATE PRINT
	THEN
	0 INDEX 1 >= IF
		OVER OVER ADD DUPLICATE PRINT
	THEN
REPEAT
```

Here's the fibonacci sequence until the value is greater than 10,000:

```ogipier
0 DUPLICATE PRINT
1 DUPLICATE PRINT
BEGIN
	OVER OVER ADD
	DUPLICATE 10000 > IF
		BREAK
	THEN
	DUPLICATE PRINT
END
```

To define and use a variable:

```ogipier
"FOO" : 42 .
FOO "The meaning of life is " CONCAT PRINT
```

To define and use a function:

```ogipier
"FIBONNACI" :
	TIMES
    0 INDEX 0 == IF 0 THEN
    0 INDEX 1 == IF 1 THEN
    0 INDEX 1 > IF OVER OVER ADD THEN
	REPEAT
.
10 FIBONNACI PRINT
```

This, for example, prints the 10th digit of the fibonacci sequence.

## Install it.

```bash
npm install
npm link
```

## Run it.

First, write your Ogipier program, saving it as `foo.ogi`.

Now, you can run:

```bash
ogipier foo.ogi --run
```

You can also save your compiled JavaScript:

```bash
ogipier foo.ogi foo.ogi.js
```

## Write it.

_N.B._: Unless specified all operations consume an element from the stack!

**Types**

- Any postive or negative number, expressed as digits or digits and decimal points will be converted into a digit.
- Characters in quotation marks will be converted into a string.

**Control**

- `IF`: Start an `if` block.
- `ELSE`: Add an `else` statement.
- `THEN`: End an `if` block.
- `==`: Check the last two elements for equlity (javascript `===`).
- `!=`: Check the last two elements for not equlity (javascript `!==`).
- `>`, `<`, `>=`, `<=`: The second element on the stack is compared to the first element on the stack in the way you'd expect.
- `BEGIN`: Start looping without end.
- `END`: End a `BEGIN` loop block.
- `TIMES`: Consume the last element and loop that many times.
- `REPEAT`: End a `TIMES` loop block.
- `BREAK`: Leave a loop.
- `CONTINUE`: Continue to the next loop.
- `AND`, `OR`, `NOT`: Boolean operations.

**Math**

- `ADD`: Add and consume the previous second to the top entries on the stack, and it will push the result to the stack.
- `SUBTRACT`: Subtract in the same way.
- `MULTIPLY`: Multiply in the same way.
- `DIVIDE`: Divide in the same way.
- `RANDOM`: Generate a random number between 0 and 1.
- `CEILING`: Gets the ceiling of a number.
- `FLOOR`: Gets the floor of a number.

**Strings**

- `CONCAT`: Convert to string and concat the second and the first entries on the stack, pushing the result to the stack.
- `PRINT`: Print the topmost entry on the stack, followed by a CR.
- `UPPERCASE`, `LOWERCASE`: Converts the top element as implied.
- `TRIM`: Removes whitespace.
- `REPLACE`: Uses the top element to replace the second element in the third element.
- `LENGTH`: Gets the length.
- `INCLUDES`, `ENDS_WITH`, `STARTS_WITH`: Checks if the top element is matching the second element.

**Stack**

- `DUPLICATE`: Duplicate the top element of the stack.
- `OVER`: Copies the second element on the stack over the top of the stack.
- `SWAP`: Swaps the first and second elements on the stack.
- `CLEAR`: Clears the stack.
- `DROP`: Drops the top element.
- `PICK`: Copies the nth element to the top.
- `ROLL`: Moves the nth element to the top.
- `DEPTH`: Gets the length

**Functions and variables (which are just functions here)**

- `:` consumes the last element on the stack, if it's a string, and makes it a keyword which can be used later. Everything after it is the function or variable definition. _N.B.: names must be all uppercase and may only include letters and underscores._
- `.` ends a function definition.