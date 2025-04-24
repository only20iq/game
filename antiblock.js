// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-04-24
// @description  try to take over the world!
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

// Mevcut observer nesnesini tutacak bir değişken
let mevcutObserver = null;
// Mevcut URL'yi saklamak için bir değişken
let mevcutUrl = window.location.href;
// Hedef elementin son bilinen referansı
let hedefElementReferansi = null;

        let hedefElement = null; // hedefElement'ı global scope'a taşıdık
let timeoutId;
let engellemeObserver = null;
let engellemeKontrolObserver = null; // Yeni observer
const TETIKLEME_ARALIGI = 12; // Her kaç kaydırmada bir tetiklenecek
let kaydirmaSayaci = 0;

function isProfilePage() {
    const pathname = window.location.pathname;
    return pathname.startsWith('/') && pathname.split('/').filter(segment => segment !== '').length === 1 && !pathname.includes('/status/') && pathname !== '/home';
}

function silEngellemeMesajlari(targetDiv) {
    if (targetDiv) {
        const engellemeMesajlari = Array.from(targetDiv.querySelectorAll('span')).filter(span => span.textContent.includes('has blocked you'));
        engellemeMesajlari.forEach(spanElement => {
            // console.log("Engelleme mesajı bulundu (silEngellemeMesajlari):", spanElement.textContent);
            let parentElement = spanElement;
            for (let i = 0; i < 5; i++) {
                if (parentElement && parentElement.parentElement) {
                    parentElement = parentElement.parentElement;
                } else {
                    console.warn("Silinecek elemente yeterince yukarı çıkılamadı (silEngellemeMesajlari).");
                    return;
                }
            }
            if (parentElement && parentElement.parentElement) {
                parentElement.parentElement.removeChild(parentElement);
                // console.log("Engelleme mesajının 5 üstündeki element silindi (silEngellemeMesajlari).");
            } else {
                // console.warn("Silinecek elementin üst elementi bulunamadı (silEngellemeMesajlari).");
            }
        });
    }
}

function baslatEngellemeKontrolObserver() {
    const targetDiv = document.querySelector('div[aria-label^="Anasayfa zaman akışı"]');
    if (targetDiv) {
        if (engellemeKontrolObserver) {
            engellemeKontrolObserver.disconnect();
        }

        engellemeKontrolObserver = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    silEngellemeMesajlari(targetDiv);
                }
            }
        });

        engellemeKontrolObserver.observe(targetDiv, { childList: true, subtree: true });
        // console.log("Engelleme kontrol observer başlatıldı.");
    } else {
        // console.warn("Engelleme kontrol observer için hedef div bulunamadı.");
    }
}

function baslatObserver() {
    let hedefElement = document.querySelector('[aria-label^="Zaman Akışı:"]');
    hedefElementReferansi = hedefElement;
    if (hedefElement) {
        kurObserver(hedefElement);
        setInterval(kontrolAltElementleri, 900); // Her 0.9 saniyede kontrol et
    } else {
        const intervalId = setInterval(() => {
            hedefElement = document.querySelector('[aria-label^="Zaman Akışı:"]');
            hedefElementReferansi = hedefElement;
            if (hedefElement) {
                clearInterval(intervalId);
                kurObserver(hedefElement);
            }
        }, 500);
    }
}

baslatObserver(); // Sayfa yüklenir yüklenmez observer'ı başlat

function kontrolAltElementleri() {
    const hedefElement = document.querySelector('[aria-label^="Zaman Akışı:"]');
    if (hedefElement) {
        const svgElementleri = hedefElement.querySelectorAll('svg');
        svgElementleri.forEach(svg => {
            const computedStyle = window.getComputedStyle(svg);
            if (computedStyle.opacity === '0.4' && svg.style.opacity !== '1') {
                guncelleElementStilleri(svg, 'periyodik-kontrol');
            } else if (computedStyle.opacity !== '1' && svg.style.opacity !== '1') {
                svg.style.opacity = '1';
            }
        });

        const retweetButtonlari = hedefElement.querySelectorAll('button[data-testid="retweet"]');
        retweetButtonlari.forEach(button => {
            const computedStyle = window.getComputedStyle(button);
            if (computedStyle.opacity === '0.5' && button.style.opacity !== '1') {
                guncelleElementStilleri(button, 'periyodik-kontrol');
            }
        });

        const paylasButtonlari = hedefElement.querySelectorAll('button[aria-label="Gönderiyi paylaş"]');
        paylasButtonlari.forEach(button => {
            const computedStyle = window.getComputedStyle(button);
            if (computedStyle.opacity === '0.5' && button.style.opacity !== '1') {
                guncelleElementStilleri(button, 'periyodik-kontrol');
            }
        });
    }
}

function handleMutations(mutationsList, observer) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        mutationsList.forEach(mutation => {
            try {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    guncelleElementStilleri(mutation.target, 'attribute-change');
                } else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element && hedefElement && hedefElement.contains(node)) {
                            guncelleElementStilleri(node, 'node-added');
                            const descendants = node.querySelectorAll('*');
                            descendants.forEach(descendant => guncelleElementStilleri(descendant, 'descendant-added'));
                        }
                    });
                }
                if (hedefElement && !document.contains(hedefElement)) {
                    observer.disconnect();
                    mevcutObserver = null;
                    setTimeout(baslatObserver, 1000);
                }
            } catch (error) {
                // console.error("Mutation işlenirken hata:", error);
            }
        });
    }, 200);
}

    function kurObserver(element) {
        if (mevcutObserver) {
            mevcutObserver.disconnect();
            mevcutObserver = null;
        }

        const observer = new MutationObserver(handleMutations);

        try {
            observer.observe(element, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] });
            // console.log("Observer aktif, 'Zaman Akışı:' içindeki değişiklikleri izliyor.");
            mevcutObserver = observer;

            const initialElements = element.querySelectorAll('svg, div[style*="color: rgb(113, 118, 123)"]');
            initialElements.forEach(el => guncelleElementStilleri(el, 'başlangıç'));

        } catch (error) {
            // console.error("Observer başlatılırken hata:", error);
        }
    }


function guncelleElementStilleri(element, kaynak = 'bilinmiyor') {
    const computedStyle = window.getComputedStyle(element);

    if (element instanceof SVGElement && computedStyle.opacity === '0.4') {
        element.style.opacity = '1';
        const classes = element.classList;
        let opacitySifirNoktaDortClass = null;
        for (let i = 0; i < classes.length; i++) {
            const className = classes[i];
            const tempElement = document.createElement('div');
            tempElement.className = className;
            document.body.appendChild(tempElement);
            const tempComputedStyle = window.getComputedStyle(tempElement);
            if (tempComputedStyle && tempComputedStyle.opacity === '0.4') {
                opacitySifirNoktaDortClass = className;
                break;
            }
            document.body.removeChild(tempElement);
        }
        if (opacitySifirNoktaDortClass) {
            element.classList.remove(opacitySifirNoktaDortClass);
        }
    } else if (element instanceof SVGElement && computedStyle && computedStyle.opacity !== '1') {
        element.style.opacity = '1';
    }

    let currentElement = element;
    while (currentElement && currentElement.nodeName.toLowerCase() !== 'button') {
        if (currentElement instanceof HTMLElement) {
            const classes = currentElement.classList;
            for (let i = 0; i < classes.length; i++) {
                const className = classes[i];
                const tempElement = document.createElement('div');
                tempElement.className = className;
                document.body.appendChild(tempElement);
                const tempComputedStyle = window.getComputedStyle(tempElement);
                if (tempComputedStyle && tempComputedStyle.opacity === '0.5') {
                    const parentButton = currentElement.closest('button[data-testid="retweet"]');
                    if (parentButton) {
                        parentButton.style.opacity = '1';
                        document.body.removeChild(tempElement);
                        return;
                    }
                }
                document.body.removeChild(tempElement);
            }
        }
        currentElement = currentElement.parentNode;
    }

    const targetRetweetButton = element.closest('button[data-testid="retweet"]');
    if (targetRetweetButton) {
        const buttonComputedStyle = window.getComputedStyle(targetRetweetButton);
        if (buttonComputedStyle.opacity === '0.5') {
            targetRetweetButton.style.opacity = '1';
        }
    }

    const targetShareButton = element.closest('button[aria-label="Gönderiyi paylaş"]');
    if (targetShareButton) {
        const buttonComputedStyle = window.getComputedStyle(targetShareButton);
        if (buttonComputedStyle.opacity === '0.5') {
            targetShareButton.style.opacity = '1';
        }
    }
}

// Fare tekerleği hareketi (orta tuş yukarı/aşağı kaydırma) dinleyicisi
window.addEventListener('wheel', (event) => {
    kaydirmaSayaci++;
    if (kaydirmaSayaci % TETIKLEME_ARALIGI === 0) {
        // console.log(`Orta tuş ile kaydırma algılandı (${kaydirmaSayaci}. tetikleme), observer yeniden başlatılıyor.`);
        if (mevcutObserver) {
            mevcutObserver.disconnect();
            mevcutObserver = null;
        }
        baslatObserver();
        mevcutUrl = window.location.href; // URL'yi de güncelle
        kaydirmaSayaci = 0; // Sayacı sıfırla
    }
});

// Profil sayfası kontrolü için interval (engelleme mesajları)
setInterval(() => {
    if (isProfilePage()) {
        baslatEngellemeKontrolObserver();
    } else if (engellemeKontrolObserver) {
        engellemeKontrolObserver.disconnect();
        engellemeKontrolObserver = null;
        // console.log("Profil sayfası dışına çıkıldı, engelleme kontrol observer durduruldu.");
    }
}, 600);

})();