
let foldersArray
let urlsArray
const folderForm = $('#folder-form')
const folderSelect = $('#folder-select')
const dataSubmit = $('#submit-url')
const folderSorter = $('#folder-sort')

$(document).ready(() =>{
  fetch('/api/v1/folders', {
    method: 'GET',
  })
    .then((data) => data.json())
    .then((folders) => {
      console.log(folders)
      foldersArray = folders
      folders.forEach((folder) => {
        $('#folders').append(`<option value="${folder.folder_name}"/>`)
      })
    })
    .catch(error => console.log(error))
})

const getAllUrls = () =>{
  fetch('/api/v1/urls', {
    method: 'GET',
  })
    .then((data) => data.json())
    .then((urls) => {
      console.log(urls)
    })
    .catch(error => console.log(error))
}

const getUrlsByFolder = (folderId) =>{
  return fetch(`/api/v1/folders/${folderId}/urls`, {
  method: 'GET',
  })
  .then((data) => data.json())
  .catch(error => console.log(error))
}

const addUrls = (folder, url, urlTitle) =>{
  fetch('/api/v1/folders/', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "folder_name": `${folder}`,
      "original_url": `${url}`,
      "title": `${urlTitle}`
    })
  })
    .then((response) => console.log(response))
    .catch(error => console.log(error))
}

folderForm
.on('change', (e) => {
  e.preventDefault()
  let folderVal = folderSelect.val()
  console.log(folderVal)

  let matchFolder = foldersArray.find((folder) =>{
    return folder.folder_name.toString() === folderVal.trim()
  })

  if(matchFolder){
    console.log('folder match')
    $('.folder-title').replaceWith(`<div class = "folder-title"><p>Selected Folder:</p><h2>${e.target.value}</h2></div>`)
    getUrlsByFolder(matchFolder.id)
      .then((urls) =>{
        urlsArray = urls
        $('.folder-title').append(`<div class = 'url-list'></div>`)
        urlList(urls)
      })
      .catch((error) => console.log(error))
    $('.folder-content').addClass('active')
  } else if (!matchFolder) {
    $('.folder-title').replaceWith(`<div class = "folder-title"><p>Create New Folder:</p><h2>${e.target.value}</h2></div>`)
    $('.folder-content').addClass('active')
  }
})
.on('submit', (e) => {
  e.preventDefault();
})

dataSubmit.click((e)=>{
  e.preventDefault()
  let folder = folderSelect.val()
  let url = $('#url').val()
  let title = $('#title').val()

  console.log(folder, url, title)
  addUrls(folder, url, title)
})

$('#url, #title, #folder-select').on('keyup', () =>{
  enableCheck()
})

folderSorter
.on('change', (e) => {
  e.preventDefault()
  e.target.value === 'popularity' ? sortUrls('popularity') : sortUrls('created_at')
})

const sortUrls = (sortType) => {
  let urls = urlsArray
  let sortedUrls = urls.sort((a, b) => {
    return a[sortType] - b[sortType]
  })
  removeUrls()
  urlSorter(sortedUrls)
}

const urlSorter = () => {
  urlsArray.forEach((url) => {
    $('.url-list').append(`<p>Title:${url.title}, ShortLink: ${url.original_url}</p>`)
  })
}

const urlList = (urls) =>{
  urls.forEach((url) =>{
    $('.url-list').append(`<p>Title:${url.title}, ShortLink: ${url.original_url}</p>`)
  })
}

const removeUrls = () =>{
  $('.url-list').empty()
}

const enableCheck = () =>{
  let folder = folderSelect.val()
  let url = $('#url').val()
  let title = $('#title').val()

  if(folder.length > 0 && url.length > 0 && title.length > 0){
    dataSubmit.prop('disabled', false)
  } else {
    dataSubmit.prop('disabled', true)
  }
}
