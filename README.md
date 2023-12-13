# Ogipier

I don't know why I made a Reverse Polish Notation language, but I did.

It compiles to JavaScript so that it can--someday--be used on the web.

Here is a basic "hello world" program:

```ogipier
"Hello, World!" OUTPUT
```

Here you can get the meaning of life:

```ogipier
21 21 ADD
```

Here's the fibonacci sequence to 20 digits:

```ogipier
0 1
OVER OVER SWAP OUTPUT OUTPUT
18 LOOP
	OVER OVER ADD PRINT
END
```

Here's the fibonacci sequence until the value is greater than 10,000:

```ogipier
0 1
OVER OVER SWAP OUTPUT OUTPUT
BEGIN
	OVER OVER ADD
	DUPLICATE 10000 > IF
		STOP
	END
	PRINT
END
```

## Installing it.

```
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