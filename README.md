# Ogipier

_It's pierogi, but reversed (sort of)..._

I don't know why I made a Reverse Polish Notation language, but I did. It compiles to JavaScript so that it can—someday, maybe—be used on the web.

## See how it works.

Here is a basic "hello world" program:

```ogipier
"Hello, World!" OUTPUT
```

Here you can get the meaning of life:

```ogipier
21 21 ADD OUTPUT
```

Here's the fibonacci sequence to 20 digits:

```ogipier
20 TIMES
	INDEX 0 == IF
		0 PRINT
		1 PRINT
	END
	INDEX 1 >= IF
		OVER OVER ADD PRINT
	END
END
```

Here's the fibonacci sequence until the value is greater than 10,000:

```ogipier
0 PRINT
1 PRINT
BEGIN
	OVER OVER ADD
	DUPLICATE 10000 > IF
		STOP
	END
	PRINT
END
```

To define and use a variable:

```ogipier
"FOO" : 42 .
"The meaning of life is" FOO CONCAT OUTPUT
```

To define and use a function:

```ogipier
"FIBONNACI" :
	TIMES
		INDEX 0 == IF 0 1 END
		INDEX 1 >= IF OVER OVER ADD END
	END
.
50 FIBONNACI PRINT
```

This, for example, prints the 50th digit of the fibonacci sequence.

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

**Types**

- Any postive or negative number, expressed as digits or digits and decimal points will be converted into a digit.
- Characters in quotation marks will be converted into a string.

**Math**

- `ADD` will add and consume the previous two entries on the stack, and it will push the result to the stack.
- `SUBTRACT` will subtract in the same way.
- `MULTIPLY` will multiply in the same way.
- `DIVIDE` will divide in the same way.

**Strings**

- `CONCAT` will convert to string and concat the previous two entries on the stack, consuming them and pushing the result to the stack.
- `PRINT` will print the topmost entry on the stack, followed by a CR.
- `OUTPUT` will conume and print the topmost entry on the stack, followed by a CR.

**Stack manipulation**

- `DUPLICATE` will duplicate the first/top element of the stack.
- `OVER` will copy the second element on the stack over the top of the stack.
- `SWAP` will swap the first and second elements on the stack.
- `DROP` will clear the stack.
- `POP` will pop off the topmost element on the stack.

**Control**

- `TIMES` takes the previous value on the stack and loops that many times.
- `BEGIN` begins an infinite loop.
- `STOP` stops a `TIMES` or `BEGIN` loop.
- `IF` evalulates the last element on the stack for truthiness.
- `END` ends a `TIMES` or `BEGIN` loop or an `IF` statement.
- `==` consumes and checks the first and second elements on the stack for equality.
- `>` consumes and check if the second element on the stack is greater than the first element.
- `>=` consumes and check if the second element on the stack is greater than or equal to the first element.
- `<` consumes and check if the second element on the stack is less than the first element.
- `<=` consumes and check if the second element on the stack is less than or equal to the first element.

**Functions and variables (which are just functions here)**

- `:` consumes the last element on the stack, if it's a string, and makes it a keyword which can be used later. Everything after it is the function or variable definition. _N.B.: names must be all uppercase and may only include letters and underscores._
- `.` ends a function definition.