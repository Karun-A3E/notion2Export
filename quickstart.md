## Setting Up 
1. After performing a git clone of the repo : ```git clone https://github.com/Karun-A3E/notion2Export.git```
2. Navigate to the cloned directory: `cd notion2Export`
3. Install all dependencies using npm or yarn (depending on your package manager): npm i
4. Perform a link using the command : ```npm link```
5. To setup and test the notion Command run the following code : ```notion setup required```
   5.1 After which a input is asked for a API Key >> Enter the Key

## Using the Tool
For usage of tool start the program using ```notion``` . For the time being the interactive program is still in dev. However the commmand line is currently usable to a certain extend. To start execute the command : notion --help

### Global Options

- `-o, --output <file>`: Specify the output file for the response.

## Database Commands
For usage of database command :: notion db
To see the list of commands that come under a database :: notion db --help
### `db append`

Append data to a database.

Usage:

```bash
notion db append --id=<database_id> [-o <output_file>]
```

- `--id <database_id>`: The ID of the database (required).

### `db read`

Read data from a database.

Usage:

```bash
notion db read [--id <database_id> | --name <database_name>] [--page <page_number>] [-o <output_file>]
```

- `--id <database_id>`: The ID of the database.
- `--name <database_name>`: The name of the database, if you are already appended it to the Document
- `--page <page_number>`: The page number.

### `db cache`

Cache database information.

Usage:

```bash
notion db cache [--list]
```

- `--list`: List cached databases.


## Setup Commands

### `setup required`

Download required ENV files.

Usage:

```bash
notion setup required
```

## Examples

- Append data to a database and save the response to a file:

```bash
notion db append --id <database_id> -o response.json
```

- Read data from a database by name and display the response:

```bash
notion db read --name <database_name>
```

- List cached databases:

```bash
notion db cache --list
```

- Read page content:

```bash
notion pg read --id <page_id>
```

- Download required files for setup:

```bash
notion setup required
```

