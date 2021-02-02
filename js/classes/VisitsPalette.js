import HtmlElement from "./HtmlElement.js";
import { Visit } from "./Visit.js";
import Div from "./Div.js";
import { VisitCardiologist } from "./VisitCardiologist.js";
import { VisitDentist } from "./VisitDentist.js";
import { VisitTherapist } from "./VisitTherapist.js";
import Request from "../queries/Request.js";

let zindex = 1;
export class VisitsPalette extends HtmlElement {
  constructor() {
    super({
      tagName: "div",
      classes: [
        "visits-palette",
        "container",
        "row",
        // "row-cols-1",
        // "row-cols-md-2", // ломают дрэг
        "row-cols-5",
        "g-5",
      ],
      attributes: [{ style: "height: 550px" }],
    });
    this.allVisits;
    this.visitCards;
    this.noVisitsEl = new Div({
      classes: ["no-visits"],
      text: "No items have been added",
    });
    if (localStorage.getItem("token")) {
      this.refreshContent();
    }
  }

  async refreshContent() {
    this.element.innerHTML = "";
    await this.getAllVisits();
    await this.createVisitCards();
    this.renderNoCardsCheck();
    this.renderCards();
  }

  async getAllVisits() {
    const getAllVisitsRequest = new Request();
    const allVisitsJson = await getAllVisitsRequest.sendRequest({
      path: "",
      method: "GET",
    });
    this.allVisits = JSON.parse(allVisitsJson);
    console.log("ALL VISITS: ", this.allVisits);
  }

  async createVisitCards() {
    this.visitCards = await this.allVisits.map((visit) => {
      switch (visit.content.doctor) {
        case "кардиолог":
          return new VisitCardiologist(visit);
        case "стоматолог":
          return new VisitDentist(visit);
        case "терапевт":
          return new VisitTherapist(visit);
        default:
          return new Visit(visit);
      }
    });
  }
  async dragFunction() {
    // await this.getAllVisits();
    let dragContainer = document.getElementsByClassName("visits-palette")[0];
    dragContainer.addEventListener("mouseover", (e) => {
      if (e.target.parentNode.classList.value == "card position-absolute") {
        dragElement(e.target.parentNode);
      }
      function dragElement(elmnt) {
        var pos1 = 0,
          pos2 = 0,
          pos3 = 0,
          pos4 = 0;
        // if (document.getElementById(elmnt.id + "header")) {
        //   // if present, the header is where you move the DIV from:
        //   document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        // } else {
        //   // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
        // }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          document.onmousemove = elementDrag;
          elmnt.style.zIndex = zindex++;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          elmnt.style.top = elmnt.offsetTop - pos2 + "px";
          elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }
    });
  }
  renderCards() {
    if (this.visitCards.length) {
      this.visitCards.forEach((visitCard) => {
        visitCard.render(this.element, "beforeend");
      });
    }
  }

  renderNoCardsCheck() {
    if (this.visitCards.length) {
      this.noVisitsEl.element.remove();
    } else {
      this.noVisitsEl.render(this.element, "beforeend");
    }
  }

  async addVisit(visitObj) {
    console.log("VISIT OBJ: ", visitObj);
    const createVisitRequest = new Request();
    const createdVisitResponse = await createVisitRequest.sendRequest({
      body: visitObj,
      path: "/",
      method: "POST",
    });
    const createdVisit = JSON.parse(createdVisitResponse);

    console.log("CREATED VISIT PALETTE", typeof createdVisit);
    let visitCard;
    switch (createdVisit.content.doctor) {
      case "кардиолог":
        visitCard = new VisitCardiologist(createdVisit);
        break;
      case "стоматолог":
        visitCard = new VisitDentist(createdVisit);
        break;
      case "терапевт":
        visitCard = new VisitTherapist(createdVisit);
        break;
      default:
        visitCard = new Visit(createdVisit);
    }
    this.refreshContent();
  }

  async removeVisit(card) {
    // delete from database
    const deleteCard = new Request();
    const deleteResponse = await deleteCard.sendRequest({
      path: `${card.visit.id}`,
      method: "DELETE",
    });
    if (deleteResponse == "") {
      card.element.remove();
    }
    this.refreshContent();
  }
}
