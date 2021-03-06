// import HtmlElement from "../classes/HtmlElement.js";
import Div from "../classes/Div.js";
import Input from "../classes/Input.js";
import Select from "../classes/Select.js";
import Button from "../classes/Button.js";
import Request from "../queries/Request.js";
import Form from "../classes/Form.js";
import { visitsPalette } from "./visitsPalette.js";

export const SearchContainer = new Form({
  classes: ["container"],
  attributes: [{ onsubmit: "return false" }],
});

const SearchFormWrapper = new Div({
  classes: ["input-group", "mb-3"],
});

const SearchInput = new Input({
  type: "text",
  classes: ["form-control", "col-5"],
  placeholder: "Ведите текст, который ищем"
});

const SearchSelectCartStatus = new Select({
  classes: ["form-select", "col-3"],

  // values - сверить с готовой карточкой
  values: ["Все", "Открытые", "Закрытые"],

  attributes: [{ selected: "" }],
});

const SearchSelectPriorityStatus = new Select({
  classes: ["form-select", "col-3"],
  values: ["Любая срочность", "Обычная", "Приоритетная", "Неотложная"],
});

const SearchSubmitBtn = new Button({
  classes: ["btn", "btn-dark"],
  type: "submit",
  text: "Поиск",
});

SearchContainer.element.addEventListener("submit", (e) => {
  e.preventDefault();

  const SearchRequest = new Request();
  const CardsArray = SearchRequest.sendRequest({
    path: "",
    method: "GET",
  });

  CardsArray.then((data) => {
    const CardsArray = JSON.parse(data);

    const result = findCards(CardsArray);

    // render filter data
    visitsPalette.applyFilter(result);
  }).catch((err) => {
    console.log(err);
  });
});

export function findCards(array) {
  const textData = SearchInput.element.value;
  let cardStatus = SearchSelectCartStatus.element.value;
  const priority = SearchSelectPriorityStatus.element.value;

  if (priority !== "Любая срочность") {
    array.forEach((card) => {
      if (card.content.urgency !== priority) {
        array.splice(array.indexOf(card), 1);
      }
    });
  }

  if (cardStatus !== "Все") {
    // status mutation
    if (cardStatus === "Открытые") {
      cardStatus = "open";
    } else {
      cardStatus = "finished";
    }

    array.forEach((card) => {
      if (card.content.status !== cardStatus) {
        array.splice(array.indexOf(card), 1);
      }
    });
  }

  const result = [];

  array.forEach((card) => {
    for (let key in card.content) {
      if (card.content[key].toLowerCase().includes(textData.toLowerCase())) {
        if (!result.includes(card)) {
          result.push(card);
        }
      }
    }
  });

  return result;
}

// render Search Form
SearchFormWrapper.render(SearchContainer.element, "beforeend");
SearchInput.render(SearchFormWrapper.element, "beforeend");
SearchSelectCartStatus.render(SearchFormWrapper.element, "beforeend");
SearchSelectPriorityStatus.render(SearchFormWrapper.element, "beforeend");
SearchSubmitBtn.render(SearchFormWrapper.element, "beforeend");
