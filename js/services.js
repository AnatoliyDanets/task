const baseUrl = `http://localhost:3000/tasks`;
async function getNotes() {
  const res = await fetch(baseUrl);
  const task = await res.json();
  return task;
}

async function createNote(data) {
  let response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let result = await response.json();
  return result;
}
function deleteNote(id) {
  fetch(baseUrl + `/${id}`, { method: "delete" })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
}
async function getNoteId(id) {
  const res = await fetch(baseUrl + `/${id}`);
  const data = await res.json();
  return data;
}
async function changeNote(id, data) {
  try {
    const response = await fetch(baseUrl + `/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log("Успех:", JSON.stringify(json));
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

async function patchNote(id, data) {
  try {
    const response = await fetch(baseUrl + `/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    console.log("Успех:", JSON.stringify(json));
  } catch (error) {
    console.error("Ошибка:", error);
  }
}
export { getNotes, createNote, deleteNote, getNoteId, changeNote, patchNote };
