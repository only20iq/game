// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/home*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var _asdasdCCCC = 0;

function listSpans() {
    if(_asdasdCCCC==1){
_asdasdCCCC = 0;
        alert("Kapatıldı");
        return;
    }else{
        _asdasdCCCC = 1;
        alert("Açıldı");
    }
    var refreshIntervalId = setInterval(function(){
if(_asdasdCCCC==0){
    clearInterval(refreshIntervalId);
        return;
    }
  let spans = document.querySelectorAll("span");
  // her span elementi için
  for (let span of spans) {
    // span'in içeriği ABCD ise
    if (span.textContent == "Seni takip ediyor") {
        console.log("Bulundu");
        span.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      // listeye ekle
      //list.push(span);
    }
  }

    }, 300);

  return;
}




function addDataOLDTABLE(data) {
    let textarea = document.getElementById("oldtableAAAAxx123x");
  // textarea nın mevcut değerini al
  let value = textarea.value;
    if(value==""){value = data;}else{
    value += (","+data);
    }
  // textarea nın değerini güncelle
  textarea.value = value;
}


    function karsilastir0123010(){
        // @Mr_Cypriot,@SY_sullyoon_,@H1KEY_official bu şekilde bir string i al ve set yap daha sonra başka bir textarea dan çektiğin veri ile sette eksik olan değeri bul
// string i al
let string = document.getElementById("aJh777ZZZaaSS33").value;
// string i virgüllere göre böl
let array = string.split(",");
// array den bir küme oluştur
let set = new Set(array);
// sayfadaki başka bir textarea elementini seç
let data = document.getElementById("oldtableAAAAxx123x").value;
document.getElementById("oldtableAAAAxx123x").value="";
// veriyi virgüllere göre böl
let otherArray = data.split(",");
// diğer array in her elemanı için
        var _tespit0x = 0;
for (let item of otherArray) {
  // eğer kümede yoksa
  if (!set.has(item)) {
    // konsola yazdır
      _tespit0x++;;;
      addDataOLDTABLE(item);
  }
}
        if(_tespit0x==0){
            alert("Kimse Seni Engellememiş. Liste sayısı: "+otherArray.length);
        }else{
alert("Seni "+_tespit0x+"kişi engelledi. Liste sayısı: "+otherArray.length);

        }


    }



function addData(data) {
    let textarea = document.getElementById("aJh777ZZZaaSS33");
  // textarea nın mevcut değerini al
  let value = textarea.value;
    if(value==""){value = data;}else{
    value += (","+data);
    }
  // textarea nın değerini güncelle
  textarea.value = value;
}





    var _askdaskdk = 0;
function delx113(){
    if(_askdaskdk==1){
        alert("Kapatıldı");
        _askdaskdk=0;
        return;
    }else{
        _askdaskdk = 1;
        alert("Açıldı");
    }
    // js aria-label="Anasayfa zaman akışı" olan elementi sil
// sayfadaki aria-label="Anasayfa zaman akışı" olan elementi seç
let element = document.querySelector("[aria-label='Anasayfa zaman akışı']");
// elementin üst elementini seç
let parent = element.parentElement;
// şimdi bunu interval döngüsü yap eğer aynı veri ile karşılaşırsa ekrana yazmasın interval 1000ms olsun
// boş bir küme oluştur
let set = new Set();
// 1000ms aralıklarla bir fonksiyon çalıştır
let interval = setInterval(function() {
    if(_askdaskdk==0){
    clearInterval(interval);
    }
  // parent içindeki tüm span elementlerini seç
  let spans = parent.querySelectorAll("span");
  // her span elementi için
    var _sada = 0;
  for (let span of spans) {

    let text = span.textContent;
    // eğer ilk karakter @ ise
    if (text[0] == "@") {
                _sada++;
        if(_sada==1){continue;}
        try{
              span.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        }catch(e){continue;}
      // eğer kümede yoksa
      if (!set.has(text)) {
        // konsola yazdır
        addData(text);
        // küme ekle
        set.add(text);
      }
    }
  }
}, 300);


// üst elementten elementi kaldır
//parent.removeChild(element);
return;
}



    // js sayfa yüklenince sayfanın üstünde navbar oluştur

window.onload = function() {
        var main_xAAA = document.createElement("div");
main_xAAA.style.left = "0";
main_xAAA.style.right = "0";
main_xAAA.style.bottom = "5";
main_xAAA.style.padding = "0";
main_xAAA.style.margin = "0";
main_xAAA.style.color = "#fff";
main_xAAA.style.position = "fixed";
main_xAAA.style.zIndex = "9999";
main_xAAA.style.fontSize = "24px";
main_xAAA.style.textDecoration ="none";
main_xAAA.style.userSelect = "none"; // Standart sözdizimi için stil ayarlayın

    var main_menu = document.createElement("div");
    var data_x_loadAAxCVV = document.createElement("div");
  // yeni bir navbar elementi oluştur
  let navbar = document.createElement("div");
    // navbar.style.overflow = "hidden"; // öğenin taşan içeriğini gizle
    navbar.style.display = "none";

  navbar.className = "navbar";

  navbar.innerHTML = `
  <div  id="mydiv" draggable="true"  ondragstart="drag(event)"   style="position: absolute;
    z-index: 9;
    background-color: transparent;-webkit-backdrop-filter: blur(10px);backdrop-filter: blur(10px);
    border: 1px solid #d3d3d3;
    text-align: center;
    cursor: move;transition: none;max-width: 100%!important; max-height: 100%!important;text-decoration: none;
  display:block;font-size:32px;position: fixed;z-index:999!important;border:2.5px solid white;resize:both;overflow:auto;">
<hp id="mydivheader" ondragstart="return false;" style="color:white;font-size:36px;"> + </hp>
    <a style="color:white;text-decoration: none;" id="aJ7GfVVV">🚫BlockView</a>
    <a style="color:white;text-decoration: none;" id="aBgXaX0A">⚠️UnfollowView</a>
    <a style="color:white;text-decoration: none;" id="aaaUU777xx">☑️Check</a>
    <br>
    <textarea id="aJh777ZZZaaSS33" style="font-size:14px!important;color:black;width:90%;height:50px;background-color: transparent;color:white;"></textarea>
    <br>
    <textarea id="oldtableAAAAxx123x" style="font-size:20px!important;color:black;width:90%;height:50px;background-color: transparent;color:white;"></textarea>
    <a id="gostergizlexxxxx" style="color:white;font-size:24px;">&lt;Gizle&gt;<a>
    <br>
  <div>
  `;
function waitForDiv() { var div = document.getElementById("mydiv");

if (div) { makeDivDraggable(div); } else { setTimeout(waitForDiv, 100); } }

function makeDivDraggable(div) { var header = div.children[0];

header.onmousedown = dragMouseDown;

function dragMouseDown(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  document.onmouseup = function(e) {
    moveDiv(e, mouseX, mouseY);
    document.onmouseup = null;
    div.style.position = "fixed";
  };
}

function moveDiv(e, mouseX, mouseY) {
  var newLeft = e.clientX;
  var newTop = e.clientY;

  div.style.left = newLeft + "px";
  div.style.top = newTop + "px";
}


}

waitForDiv();
function Jh678xCaLLLx(){
  try {
if(navbar.style.display=="none"){
    data_x_loadAAxCVV.style.display = "none";
navbar.style.display = "block";
}else{
        data_x_loadAAxCVV.style.display = "block";
    navbar.style.display = "none";
}
  } catch (error) {
  }
}


  let body = document.querySelector("body");

  body.insertBefore(navbar, body.firstChild);

    let asdsadas = document.querySelector("#gostergizlexxxxx");
asdsadas.addEventListener("click", function() {
Jh678xCaLLLx();




});



data_x_loadAAxCVV.textContent = "<Menu>";
data_x_loadAAxCVV.style.padding = "0";
data_x_loadAAxCVV.style.margin = "0";
data_x_loadAAxCVV.style.color = "#fff";
data_x_loadAAxCVV.style.position = "flex";
data_x_loadAAxCVV.style.float = "left";
data_x_loadAAxCVV.style.fontSize = "24px";
data_x_loadAAxCVV.style.textDecoration ="none";
data_x_loadAAxCVV.style.userSelect = "none";

data_x_loadAAxCVV.addEventListener("click", ()=>{
Jh678xCaLLLx();
});


main_xAAA.appendChild(data_x_loadAAxCVV);
main_menu.appendChild(main_xAAA);
body.insertBefore(main_menu, body.firstChild);
let button = document.querySelector("#aBgXaX0A");
button.addEventListener("click", function() {
listSpans();
});


let button1 = document.querySelector("#aJ7GfVVV");
button1.addEventListener("click", function() {
delx113();
});


let button2 = document.querySelector("#aaaUU777xx");
button2.addEventListener("click", function() {
karsilastir0123010();
});



};
// alert('Process Complete');
    // Your code here...
})();