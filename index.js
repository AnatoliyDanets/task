import getRefs from "./js/refs.js";
import {
  getNotes,
  createNote,
  deleteNote,
  getNoteId,
  changeNote,
  patchNote,
} from "./js/services.js";
const refs = getRefs();

function toggleModal() {
  refs.modal.classList.toggle("is-hidden");
}

refs.openModalBtn.addEventListener("click", toggleModal);
refs.closeModalBtn.addEventListener("click", toggleModal);
const timeElapsed = Date.now();
const today = new Date(timeElapsed);

getNotes().then((tasks) => {
  return refs.column.insertAdjacentHTML("beforeend", renderTableNotes(tasks));
});
function renderTableNotes(arr) {
  return arr
    .map((el, i, a) => {
      if (el.isActive == true)
        return `<tr id=${el.id} class=''>
      <td>${el.name}</td>
      <td>${el.createDate}</td>
      <td>${el.category}</td>
      <td>${el.todo}</td>
      <td class='table-date'>${el.date}</td>
      <td>
      <div class="wrap-btn">
      <button type="button" class="edit"><svg class='icon-edit' version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#7f8383" width="32" height="32" viewBox="0 0 32 32">
      <path  d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
      </svg></button>
      <button type="button" class="archiv"><svg class='icon-edit' version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#7f8383" width="32" height="32" viewBox="0 0 32 32">
      <title>box-add</title>
      <path d="M26 2h-20l-6 6v21c0 0.552 0.448 1 1 1h30c0.552 0 1-0.448 1-1v-21l-6-6zM16 26l-10-8h6v-6h8v6h6l-10 8zM4.828 6l2-2h18.343l2 2h-22.343z"></path>
      </svg></button>
      <button type="submit" class="del"><svg class='icon-edit' version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#7f8383" width="32" height="32" viewBox="0 0 32 32">
      <title>bin</title>
      <path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path>
      <path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path>
      </svg></button>
      </div>
      </td>
          </tr>`;
    })
    .join("");
}
function addDateCell(e) {
  if (e.target.classList.contains("table-date")) {
    if (e.target.childNodes[0]) {
      e.target.classList.add("add");
    } else {
      e.target.innerHTML =
        ' <input type="date" name="date" id="date" class=" date" value="2022-04-07" min="2022-04-07"  max="2050-12-31"  />';
    }
  }
}
document.addEventListener("click", addDateCell);
function addDate(e) {
  if (e.target.classList.contains("date")) {
    // e.target.parentNode.classList.add('add')
    e.target.parentNode.classList.remove("table-date");
    e.target.classList.remove("date");
    const date = e.target.value
      .replace(/-/g, "/")
      .split("/")
      .reverse()
      .join("/");
    const { id } = e.target.parentNode.parentNode;
    const info = { id: id, date: date };
    localStorage.setItem(`${id}`, JSON.stringify(info));
    e.target.parentNode.innerHTML = date;
    e.preventDefault();
    const newDate = { date: date };
    patchNote(id, newDate);
  }
}
document.addEventListener("input", addDate);
function secondDate(e) {
  if (e.target.classList.contains("add")) {
    console.log(
      e.target.insertAdjacentHTML(
        "beforeend",
        ' <input type="date" name="date1" id="date1" class=" date1" value="2022-04-07" min="2022-04-07"  max="2050-12-31"  />'
      )
    );
  }
}
document.addEventListener("click", secondDate);

function secDate(e) {
  if (e.target.classList.contains("date1")) {
    const date =
      "," +
      " " +
      e.target.value.replace(/-/g, "/").split("/").reverse().join("/");
    e.target.parentNode.insertAdjacentHTML("beforeend", date);
    const { id } = e.target.parentNode.parentNode;
    console.log(typeof e.target.parentNode);
    const getLocalInfo = localStorage.getItem(`${id}`);
    const parseLocalInfo = JSON.parse(getLocalInfo);
    if (parseLocalInfo.id === id) {
      // e.preventDefault();
      const newDate = { date: parseLocalInfo.date + date };
      e.target.remove();

      patchNote(id, newDate);
    }
  }
}
document.addEventListener("input", secDate);

function submitForm(e) {
  e.preventDefault();
  const newTask = {
    name: refs.form[0].value,
    createDate: today.toDateString(),
    category: refs.form[1].value,
    todo: refs.form[2].value,
    date: "",
    isActive: true,
  };

  createNote(newTask);
}
refs.form.addEventListener("submit", submitForm);

function removeNote(e) {
  if (e.target.classList.contains("del")) {
    return deleteNote(e.target.parentNode.parentNode.parentNode.id);
  }
}

document.addEventListener("click", removeNote);
function openModalChange(e) {
  if (e.target.classList.contains("edit")) {
    refs.modal1.classList.toggle("is-hidden");
    getNoteId(e.target.parentNode.parentNode.parentNode.id).then((data) => {
      return Object.values(data).map((el, i, a) => {
        return (
          (refs.form1[0].value = a[0]),
          (refs.form1[1].value = a[1]),
          (refs.form1[2].value = a[2]),
          (refs.form1[3].value = a[3]),
          (refs.form1[4].value = a[4]),
          refs.form1.childNodes[1].setAttribute("id", a[6]),
          console.log(refs.form1.childNodes[1])
        );
      });
    });
  }
}
document.addEventListener("click", openModalChange);
refs.closeModalBtn1.addEventListener("click", () => {
  return refs.modal1.classList.toggle("is-hidden");
});

function submitChangeForm(e) {
  e.preventDefault();
  const newTask = {
    name: refs.form1[0].value,
    createDate: today.toDateString(),
    category: refs.form1[2].value,
    todo: refs.form1[3].value,
    date: refs.form1[4].value,
    isActive: true,
  };
  const { id } = e.target.childNodes[1];
  changeNote(id, newTask);
}
refs.form1.addEventListener("submit", submitChangeForm);

function archivModal(e) {
  if (e.target.classList.contains("archiv")) {
    const { id } = e.target.parentNode.parentNode.parentNode;
    refs.modal3.setAttribute("id", id);
    refs.modal3.classList.toggle("is-hidden");
  }
}
document.addEventListener("click", archivModal);
refs.cancelBtn.addEventListener("click", () =>
  refs.modal3.classList.toggle("is-hidden")
);

function fetchActive(e) {
  e.preventDefault();
  const data = { isActive: false };
  let { id } = e.target.parentNode.parentNode;
  patchNote(id, data);
}
refs.addBtnArchiv.addEventListener("click", fetchActive);

getNotes().then((tasks) => {
  tasks.every((el) => el.isActive == true)
    ? (refs.column3.innerHTML = "<h2 style=font-size:50px;>Not Notes</h2>")
    : refs.column3.insertAdjacentHTML("beforeend", renderTableArchived(tasks));
});

function renderTableArchived(arr) {
  if (arr.length > 0) {
    return arr
      .map((el, i, a) => {
        if (el.isActive === false)
          return `<tr id=${el.id}>
      <td>${el.name}</td>
      <td>${el.createDate}</td>
      <td>${el.category}</td>
      <td>${el.todo}</td>
      <td>${el.date}</td>
      <td><button type="submit" class="unarchiv"><svg
      class="icon-edit"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      fill="#7f8383" width="32"
      height="32"
      viewBox="0 0 32 32"
      >
      <title>box-remove</title>
      <path
        d="M26 2h-20l-6 6v21c0 0.552 0.448 1 1 1h30c0.552 0 1-0.448 1-1v-21l-6-6zM20 20v6h-8v-6h-6l10-8 10 8h-6zM4.828 6l2-2h18.343l2 2h-22.343z"
      ></path>
      </svg></button></td>
      </tr>`;
      })
      .join("");
  }
}

function unArchivData(e) {
  if (e.target.classList.contains("unarchiv")) {
    e.preventDefault();
    const data = { isActive: true };
    let { id } = e.target.parentNode.parentNode;
    patchNote(id, data);
  }
}
document.addEventListener("click", unArchivData);
function toggleModal2() {
  refs.modal2.classList.toggle("is-hidden");
}
refs.unArchivBtn.addEventListener("click", toggleModal2);
refs.closeModalBtn2.addEventListener("click", toggleModal2);

function archivedCategories() {
  getNotes().then((tasks) => {
    const arr = tasks.map((val) => {
      const ar = tasks.reduce(
        (acc, el) => {
          if (val.category === el.category) {
            acc.category = el.category;
            if (el.isActive) {
              acc.active += 1;
            } else {
              acc.archived += 1;
            }
          }
          return acc;
        },
        { category: "", active: 0, archived: 0 }
      );
      return ar;
    });

    console.log(arr);

    const newArr = arr.reduce(
      (acc, el) => (
        acc.find(({ category }) => el.category === category) || acc.push(el),
        acc
      ),
      []
    );

    console.log(newArr);

    return refs.column2.insertAdjacentHTML(
      "beforeend",
      renderTableCount(newArr)
    );
  });
}
function renderTableCount(arr) {
  return arr
    .map((el) => {
      return `<tr><td>${el.category}</td>
    <td>${el.active}</td>
    <td>${el.archived}</td>
    </tr>`;
    })
    .join("");
}

archivedCategories();
