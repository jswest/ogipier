# Ogipier

I don't know why I made a Reverse Polish Notation language, but I did.

It compiles to JavaScript so that it can—someday, maybe—be used on the web.

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

## Installing it.

```bash
npm install
npm link
```

## Running it.

First, write your Ogipier program, saving it as `foo.ogi`.

Now, you can run:

```bash
ogipier foo.ogi --run
```

You can also save your compiled JavaScript:

```bash
ogipier foo.ogi foo.ogi.js
```

## Example

Try:

```bash
ogipier example.ogi --run
```