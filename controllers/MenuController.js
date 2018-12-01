const inquirer = require('inquirer');
const ContactController = require("./ContactController");

module.exports = class MenuController {
  constructor() {
    this.mainMenuQuestions = [
      {
        type: "list",
        name: "mainMenuChoice",
        message: "Please choose from an option below: ",
        choices: [
          "Add new contact",
          "View all contacts",
          "Search for a contact",
          "Get date",
          "Exit"
        ]
      }
    ];
    //this.contacts = [];
    this.book = new ContactController();
  }

  main() {
    //console.log('hello from main');
    console.log(`Welcome to Address Booc!`);
    inquirer.prompt(this.mainMenuQuestions).then((response) => {
      switch(response.mainMenuChoice) {
        case "Add new contact":
          this.addContact();
          break;
        case "View all contacts":
          this.getContacts();
          break;
        case "Search for a contact":
          this.search();
          break;
        case "Get date":
          this.getDate();
          break;
        case "Exit":
          this.exit();
        default:
          console.log("Invalid input");
          this.main();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  clear() {
    //console.log('hello from clear');
    console.log("\x1Bc");
  }

  addContact() {
    this.clear();
    inquirer.prompt(this.book.addContactQuestions)
    .then((answers) => {
      this.book.addContact(answers.name, answers.phone, answers.email)
      .then((contact) => {
        console.log("Contact added successfully!");
        console.log("---------------");
        this.main();
      })
      .catch((err) => {
        console.log(err);
        console.log("---------------");
        this.main();
      });
    });
  }

  getContacts() {
    this.clear();
    this.book.getContacts()
    .then((contacts) => {
      for(let contact of contacts) {
        this._printContact(contact);
      }
      this.main();
    })
    .catch((err) => {
      console.log(err);
      console.log("---------------");
      this.main();
    });
  }

  search() {
    inquirer.prompt(this.book.searchQuestions)
    .then((target) => {
      this.book.search(target.name)
      .then((contact) => {
        if(contact === null) {
          console.log("Contact not found.");
          inquirer.prompt(this.book.searchAgainQuestions)
          .then((answer) => {
            switch(answer.selected) {
              case "Search again":
                this.search();
                break;
              case "Main menu":
                console.log("---------------");
                this.main();
                break;
              default:
                console.log("Something went wrong.");
                console.log("---------------");
                this.main();
            }
          });
        } else {
          this.showContact(contact);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("---------------");
      this.main();
    });
  }

  showContact(contact) {
    this._printContact(contact);
    inquirer.prompt(this.book.showContactQuestions)
    .then((answer) => {
      switch(answer.selected) {
        case "Delete contact":
          this.delete(contact);
          break;
        case "Main menu":
          console.log("---------------");
          this.main();
          break;
        default:
          console.log("Something went wrong.");
          console.log("---------------");
          this.showContact(contact);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("---------------");
      this.showContact(contact);
    });
  }

  delete(contact) {
    inquirer.prompt(this.book.deleteConfirmQuestions)
    .then((answer) => {
      if(answer.confirmation) {
        this.book.delete(contact.id);
        console.log("Contact deleted!");
        console.log("---------------");
        this.main();
      } else {
        console.log("Contact not deleted");
        this.showContact(contact);
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("---------------");
      this.main();
    });
  }

  _printContact(contact) {
    console.log(`
      name: ${contact.name}
      phone number: ${contact.phone}
      email: ${contact.email}
      ---------------`
    );
  }

  getDate() {
    let date = new Date();
    let time = date.toLocaleTimeString('en-US', { 
                                                  hour12: true,
                                                  hour: "numeric",
                                                  minute: "2-digit"
                                                });
    date = date.toLocaleDateString('en-US', { 
                                              weekday: "long",
                                              month: "long",
                                              day: "numeric",
                                              year: "numeric",
                                            });
    console.log(`${date}; ${time}`);
    console.log("---------------");
    this.main();
  }
  
  exit() {
    console.log("Thanks for using Address Booc!");
    process.exit();
  }
}
