import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";

menu();

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Propriedades CSS",
        choices: ["Ver lista", "Adicionar propridade", "Deletar propridade", "Sair"],
      },
    ])

    .then((answer) => {
      const action = answer["action"];

      if (action === "Ver lista") {
        getList();
      } else if (action === "Adicionar propridade") {
        postItem();
      } else if (action === "Deletar propridade") {
        deleteItem();
      } else if (action === "Sair") {
        sair();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const readFileLines = () => {
  return fs
    .readFileSync("css_list.txt")
    .toString("UTF8")
    .split("\n");
}

function getList() {
  let str = readFileLines()
    .sort()
    .toString()
    .replace(",", "")
    .replace(/,/g, "\n");

  const data = str;
  console.log(chalk.blueBright.bold(data));
  menu();
}

function existItem(item) {
  const items = readFileLines()

  if (items.includes(item)) {
    return true;
  } else {
    return false;
  }
}

function postItem() {
  inquirer
    .prompt([
      {
        name: "item",
        message: "Digite o nome da propridade que deseja adicionar: ",
      },
    ])

    .then((resp) => {
      const item = resp["item"];
      const newItem = item.toLowerCase()

      if (newItem === "sair") {
        sair();
      }

      if (existItem(newItem)) {
        console.log(chalk.bgYellowBright.black("A propriedade css já existe, digite outra."));
        postItem();
      } else {
        fs.appendFileSync("css_list.txt", `${newItem}\n`);
        console.log(
          chalk.bgGreen.black(`Propriedade ${newItem} criada com sucesso!`)
        );
        getList();
      }
    });
}

function deleteItem() {
  inquirer
    .prompt([
      {
        name: "delete",
        message: "Digite a propriedade que deseja deletar: ",
      },
    ])

    .then((resp) => {
      const item = resp["delete"];
      const delItem = item.toLowerCase()

      if (delItem === "sair") {
        sair();
      }
      if (!existItem(delItem)) {
        console.log(chalk.bgRedBright.black(`A propriedade ${delItem} não foi encontrada, digite novamente.`));
        deleteItem();
      } else {
        const str = readFileLines().toString().replace(delItem, "");
        const data = str.replace(/,/g, "\n").replace(/\n\n/, "\n");

        fs.writeFileSync("css_list.txt", data);

        console.log(chalk.bgCyan.black(`Propriedade ${delItem} deletada com sucesso!`))
        getList();
      }
    });
}

function sair() {
  console.log(chalk.bgMagenta.black.bold("Bye"));
  process.exit();
}