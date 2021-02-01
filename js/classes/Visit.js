import Button from "./Button.js";
import HtmlElement from "./HtmlElement.js";
import { visitsPalette } from "../components/visitsPalette.js";
import Div from "./Div.js";
import { VisitForm } from "./VisitForm.js";

export class Visit extends HtmlElement {
  constructor(visit) {
    super({tagName: "div",
      classes: ["col"],
    })
    this.createVisitForm = new VisitForm();
    this.visit = visit;
    this.visitPropertiesStart;
    this.addDefaultFields();
    this.addControls();
  }
  async addDefaultFields() {
    this.cardElement = new Div({
      classes: ["card"],
    })

    this.cardHeader = new Div({classes: ["card-header"]});
    this.cardHeader.render(this.cardElement.element, "beforeend");

    this.cardElement.render(this.element, "beforeend");
    this.cardBody = new Div({
      classes: ["card-body"]
    })
    this.cardBody.render(this.cardElement.element, "beforeend");
    this.visitPropertiesStart = new HtmlElement({
      tagName: "ul",
      classes: ["list-group", "mb-3"],
      attributes: [{
        "style": "list-style: none;"
      }]
    })

    const nameItem = new HtmlElement({
      tagName: "li",
      classes: ["list-group-item"],
      text: `Имя пациента: ${this.visit.content.name} ${this.visit.content.secondName} ${this.visit.content.byFather}`
    })
    nameItem.render(this.visitPropertiesStart.element, "beforeend");

    const doctorItem = new HtmlElement({
      tagName: "li",
      classes: ["list-group-item"],
      text: `Врач: ${this.visit.content.doctor}`
    })
    doctorItem.render(this.visitPropertiesStart.element, "beforeend");


    /* show more */
    this.showMoreBtn = new Button({
      classes: ["btn", "btn-primary", "btn-sm", "mb-3"],
      type: "button",
      attributes: [{"data-bs-toggle": "collapse"}, {"data-bs-target": `#moreProperties_${this.visit.id}`}],
      text: "Show more"
    })
    this.showMoreBtn.element.addEventListener("click", () => {
      this.showLessBtn.element.style.display = "inline-block";
      this.showMoreBtn.element.style.display = "none";
    })

    this.showLessBtn = new Button({
      classes: ["btn", "btn-primary", "btn-sm", "mb-3"],
      type: "button",
      attributes: [{"data-bs-toggle": "collapse"}, {"data-bs-target": `#moreProperties_${this.visit.id}`}],
      text: "Show less"
    })
    this.showLessBtn.element.style.display = "none";
    this.showLessBtn.element.addEventListener("click", () => {
      this.hideChangeButtons();
      this.showMoreBtn.element.style.display = "inline-block";
      this.showLessBtn.element.style.display = "none";
    })

    this.moreBlock = new Div({
      id: `moreProperties_${this.visit.id}`,
      classes: ["collapse"]
    });

    this.visitPropertiesMore = new HtmlElement({
      tagName: "ul",
      classes: ["list-group", "mb-3"],
      attributes: [{
        "style": "list-style: none;"
      }],
    })

    const purposeItem = new HtmlElement({
      tagName: "li",
      classes: ["list-group-item"],
      text: `Цель визита: ${this.visit.content.purpose}`
    })
    purposeItem.render(this.visitPropertiesMore.element, "beforeend");

    const shortDescrItem = new HtmlElement({
      tagName: "li",
      classes: ["list-group-item"],
      text: `Краткое описание визита: ${this.visit.content.shortDescrItem}`
    })
    shortDescrItem.render(this.visitPropertiesMore.element, "beforeend");

    const urgencyItem = new HtmlElement({
      tagName: "li",
      classes: ["list-group-item"],
      text: `Срочность: ${this.visit.content.urgencyItem}`
    })
    urgencyItem.render(this.visitPropertiesMore.element, "beforeend");

    this.visitPropertiesStart.render(this.cardBody.element, "beforeend");
    this.visitPropertiesMore.render(this.moreBlock.element, "beforeend");
    this.showMoreBtn.render(this.cardBody.element, "beforeend");
    this.showLessBtn.render(this.cardBody.element, "beforeend")
    this.moreBlock.render(this.cardBody.element, "beforeend");
  }
  addControls() {
    /* Close button */
    this.closeBtn = new Button({
      type: "button",
      classes: ["btn-close", "float-end"]
    })
    this.closeBtn.render(this.cardHeader.element, "beforeend")
    this.closeBtn.element.addEventListener("click", () => {
      visitsPalette.removeVisit(this)
    })

    /* Edit button */
    this.EditBtn = new Button({
      classes: ["btn", "btn-primary", "mb-3"],
      text: "Edit"
    })
    this.EditBtn.render(this.moreBlock.element, "beforeend");
    this.changeButtonsContainer = new Div({classes: ["d-md-block"]});

    /* Delete button */
    this.deleteBtn = new Button({
      classes: ["btn", "btn-danger", "me-4", "col"],
      text: "Delete"
    })
    this.deleteBtn.render(this.changeButtonsContainer.element, "beforeend");
    this.deleteBtn.element.addEventListener("click", () => {
      visitsPalette.removeVisit(this)
    })

    /* Change button */
    this.ChangeBtn = new Button({
      classes: ["btn", "btn-success", "me-4", "col"],
      text: "Change card"
    })
    this.ChangeBtn.render(this.changeButtonsContainer.element, "beforeend");
    this.ChangeBtn.element.addEventListener("click", () => {
      /* TODO: change card */
      this.changeCard();
    })

    /* listen to Edit click */
    this.EditBtn.element.addEventListener("click", () => {
      this.showChangeButtons();
    })
  }
  showChangeButtons() {
    /* render Change and Delete buttons container */
    this.changeButtonsContainer.render(this.moreBlock.element, "beforeend");
  }
  hideChangeButtons() {
    this.changeButtonsContainer.element.remove();
  }
  changeCard() {
    this.cardBody.element.innerHTML = "";

    /* gather form */
  }
}
