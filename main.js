async function LoadData() {
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';

    for (const post of posts) {
        let style = post.isDeleted
            ? 'style="text-decoration: line-through; color: gray;"'
            : '';

        body.innerHTML += `<tr ${style}>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
            <td>
                ${
                    post.isDeleted
                    ? '<i>Deleted</i>'
                    : `<input type="submit" value="Delete" onclick="Delete(${post.id})"/>`
                }
            </td>
        </tr>`;
    }
}

async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    // 👉 CREATE
    if (id === "") {
        let newId = await getNewId("http://localhost:3000/posts");

        let res = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                title: title,
                views: views,
                isDeleted: false
            })
        });

        if (res.ok) console.log("Thêm mới thành công");
    }
    // 👉 UPDATE
    else {
        let getItem = await fetch("http://localhost:3000/posts/" + id);

        if (!getItem.ok) {
            alert("Không tồn tại bài viết!");
            return;
        }

        let post = await getItem.json();

        if (post.isDeleted) {
            alert("Bài viết đã bị xoá!");
            return;
        }

        let res = await fetch("http://localhost:3000/posts/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                title: title,
                views: views,
                isDeleted: false
            })
        });

        if (res.ok) console.log("Cập nhật thành công");
    }

    LoadData();
    return false;
}

async function Delete(id) {
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    if (res.ok) {
        console.log("Xoá mềm thành công");
    }

    LoadData();
}

async function getNewId(url) {
    let res = await fetch(url);
    let data = await res.json();

    if (data.length === 0) return "1";

    let maxId = Math.max(...data.map(x => parseInt(x.id)));
    return (maxId + 1).toString();
}

async function LoadComments() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();
    let body = document.getElementById("comment_table");
    body.innerHTML = "";

    for (const c of comments) {
        let style = c.isDeleted
            ? 'style="text-decoration: line-through; color: gray;"'
            : '';

        body.innerHTML += `<tr ${style}>
            <td>${c.id}</td>
            <td>${c.text}</td>
            <td>${c.postId}</td>
            <td>
                ${
                    c.isDeleted
                    ? '<i>Deleted</i>'
                    : `
                        <input type="submit" value="Edit" onclick="FillComment('${c.id}')"/>
                        <input type="submit" value="Delete" onclick="DeleteComment('${c.id}')"/>
                      `
                }
            </td>
        </tr>`;
    }
}

async function SaveComment() {
    let id = document.getElementById("cmt_id_txt").value.trim();
    let text = document.getElementById("cmt_text_txt").value;
    let postId = document.getElementById("cmt_postid_txt").value;

    // CREATE
    if (id === "") {
        let newId = await getNewId("http://localhost:3000/comments");

        await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                text: text,
                postId: postId,
                isDeleted: false
            })
        });
    }
    // UPDATE
    else {
        let res = await fetch("http://localhost:3000/comments/" + id);
        let cmt = await res.json();

        if (cmt.isDeleted) {
            alert("Comment đã bị xoá!");
            return;
        }

        await fetch("http://localhost:3000/comments/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                text: text,
                postId: postId,
                isDeleted: false
            })
        });
    }

    LoadComments();
    ClearCommentForm();
}


async function FillComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id);
    let c = await res.json();

    document.getElementById("cmt_id_txt").value = c.id;
    document.getElementById("cmt_text_txt").value = c.text;
    document.getElementById("cmt_postid_txt").value = c.postId;
}

async function DeleteComment(id) {
    await fetch("http://localhost:3000/comments/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    LoadComments();
}

function ClearCommentForm() {
    document.getElementById("cmt_id_txt").value = "";
    document.getElementById("cmt_text_txt").value = "";
    document.getElementById("cmt_postid_txt").value = "";
}



LoadData();
LoadComments();