import { baseURL, endpoints } from "../../../constants/api.constants";
import { cardConstants } from "../cards.constants";
import { message } from "antd";
import { getCookie, setCookie } from "../../../helpers/cookie";
import { logout } from "../../user/actions";
import { store } from "./../../store";

export const editCard = (id, cardData) => {
  return dispatch => {
    dispatch(request());
    return editCardService(id, cardData).then(answer => {
      if (answer.status === "ok") {
        dispatch(success(answer.message));
        message.success("Редактирование успешно");
      } else {
        dispatch(failure(answer.message));
        dispatch(logout());
        message.error("Ошибка редактирования");
      }
    });

    function request() {
      return { type: cardConstants.EDIT_CARD_REQUEST };
    }

    function success(cardsInfo) {
      return { type: cardConstants.EDIT_CARD_SUCCESS, cardsInfo };
    }

    function failure(error) {
      return { type: cardConstants.EDIT_CARD_FAILURE, error };
    }
  };
};

async function editCardService(id, cardData) {
  const body = new FormData();
  body.append("text", cardData.text);
  body.append("status", cardData.status ? "10" : "0");
  body.append("token", getCookie("token"));

  const state = store.getState();
  const { cards } = state.cardsReducer;

  const oldCardData = cards.filter(it => it["id"] === id)[0];

  if (oldCardData["text"] !== cardData["text"]) {
    const editedIds = JSON.parse(getCookie("editedIds") || "[]");
    editedIds.push(id);
    setCookie("editedIds", JSON.stringify(editedIds));
  }

  const requestOptions = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    redirect: "follow",
    referrer: "no-referrer",
    body
  };

  const query = `${baseURL}${endpoints.editTask}/${id}/?developer=Name`;

  const data = await fetch(query, requestOptions);
  const answer = await data.json();
  return answer;
}
