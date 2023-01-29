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
        choices: ["Ver a lista", "Adicionar item", "Excluir item", "Sair"],
      },
    ])

    .then((answer) => {
      const action = answer["action"];

      if (action === "Ver a lista") {
        getList();
      } else if (action === "Adicionar item") {
        postItem();
      } else if (action === "Excluir item") {
        deleteItem();
      } else if (action === "Sair") {
        sair();
      }
    })

    .catch((error) => {
      console.log(error);
    });
}

function orderList() {
  getList();
}

function getList() {
  const readFileLines = fs
    .readFileSync("css_list.txt")
    .toString("UTF8")
    .split("\n");

  let str = readFileLines
    .sort()
    .toString()
    .replace(",", "")
    .replace(/,/g, "\n");

  const data = str;
  console.log(data);

  menu();
}

function existItem(item) {
  const items = fs.readFileSync("css_list.txt").toString("UTF8").split("\n");

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
      const newItem = resp["item"];

      if (newItem === "sair") {
        sair();
      }

      if (existItem(newItem)) {
        console.log("A propriedade css já existe");
        postItem();
      } else {
        fs.appendFileSync("css_list.txt", `${newItem}\n`);
        console.log(
          chalk.bgGreen.black(`Propriedade ${newItem} criada com sucesso!`)
        );
        orderList();
      }
    });
}

function deleteItem() {
  inquirer
    .prompt([
      {
        name: "delete",
        message: "Digite a propriedade que deseja excluir",
      },
    ])

    .then((resp) => {
      const delItem = resp["delete"];

      if (delItem === "sair") {
        sair();
      }
      if (!existItem(delItem)) {
        console.log("Apropriedade não existe");
        deleteItem();
      } else {
        const readFileLines = fs
          .readFileSync("css_list.txt")
          .toString("UTF8")
          .split("\n");

        const str = readFileLines.toString().replace(delItem, "");
        const strList = str.replace(/,/g, "\n");
        const data = strList.replace(/\n\n/, "\n");

        fs.writeFileSync("css_list.txt", data);
        getList();
      }
    });
}

function sair() {
  console.log("Bye");
  process.exit();
}
