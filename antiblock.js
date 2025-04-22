// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-04-22
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

function baslatObserver() {
    let hedefElement = document.querySelector('[aria-label="Zaman Akışı: Sohbet"]');
    // console.log("Hedef Element (aria-label='Zaman Akışı: Sohbet'):", hedefElement);
    hedefElementReferansi = hedefElement;
    if (hedefElement) {
        kurObserver(hedefElement);
        // Periyodik alt element kontrolü (eklendi)
        setInterval(kontrolAltElementleri, 900); // Her 2 saniyede kontrol et
    } else {
        // console.warn("Hedef element (aria-label='Zaman Akışı: Sohbet') bulunamadı. Daha sık arama yapılacak.");
        const intervalId = setInterval(() => {
            hedefElement = document.querySelector('[aria-label="Zaman Akışı: Sohbet"]');
            // console.log("Hedef element aranıyor...", hedefElement);
            hedefElementReferansi = hedefElement;
            if (hedefElement) {
                // console.log("Hedef element bulundu, observer başlatılıyor.");
                clearInterval(intervalId);
                kurObserver(hedefElement);
            }
        }, 500);
    }
}

function kontrolAltElementleri() {
    const hedefElement = document.querySelector('[aria-label="Zaman Akışı: Sohbet"]');
    if (hedefElement) {
        const svgElementleri = hedefElement.querySelectorAll('svg');
        svgElementleri.forEach(svg => {
            const computedStyle = window.getComputedStyle(svg);
            if (computedStyle.opacity === '0.4' && svg.style.opacity !== '1') {
                // console.log("Periyodik kontrol: Opaklığı 0.4 olan SVG bulundu:", svg);
                guncelleElementStilleri(svg, 'periyodik-kontrol');
            } else if (computedStyle.opacity !== '1' && svg.style.opacity !== '1') {
                // console.log("Periyodik kontrol: Opaklığı 1 olmayan SVG bulundu:", svg, `Mevcut Opaklık: ${computedStyle.opacity}`);
                svg.style.opacity = '1';
            }
        });

        const retweetButtonlari = hedefElement.querySelectorAll('button[data-testid="retweet"]');
        retweetButtonlari.forEach(button => {
            const computedStyle = window.getComputedStyle(button);
            if (computedStyle.opacity === '0.5' && button.style.opacity !== '1') {
                // console.log("Periyodik kontrol: Opaklığı 0.5 olan retweet butonu bulundu:", button);
                guncelleElementStilleri(button, 'periyodik-kontrol');
            }
        });

        const paylasButtonlari = hedefElement.querySelectorAll('button[aria-label="Gönderiyi paylaş"]');
        paylasButtonlari.forEach(button => {
            const computedStyle = window.getComputedStyle(button);
            if (computedStyle.opacity === '0.5' && button.style.opacity !== '1') {
                // console.log("Periyodik kontrol: Opaklığı 0.5 olan paylaş butonu bulundu:", button);
                guncelleElementStilleri(button, 'periyodik-kontrol');
            }
        });
    }
}

function handleMutations(mutationsList, observer) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        mutationsList.forEach(mutation => {
            // console.log("Mutasyon Tipi:", mutation.type);
            // console.log("Mutasyon Hedefi:", mutation.target);

            try {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    guncelleElementStilleri(mutation.target, 'attribute-change');
                } else if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // console.log("Eklenen Düğümler:", mutation.addedNodes);
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element && hedefElement && hedefElement.contains(node)) {
                            // console.log("İşlenen Eklenen Düğüm:", node);
                            guncelleElementStilleri(node, 'node-added');
                            const descendants = node.querySelectorAll('*');
                            descendants.forEach(descendant => guncelleElementStilleri(descendant, 'descendant-added'));
                        }
                    });
                }
                if (hedefElement && !document.contains(hedefElement)) {
                    // console.warn("Hedef element kayboldu. Observer durduruluyor ve yeniden başlatılacak.");
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

    function kurObserver(element) { // Fonksiyon parametresini 'element' olarak değiştirdik
        if (mevcutObserver) {
            mevcutObserver.disconnect();
            mevcutObserver = null;
        }

        const observer = new MutationObserver(handleMutations);

        try {
            observer.observe(element, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] }); // 'element' ile gözlemle
            console.log("Observer aktif, 'Zaman Akışı: Sohbet' içindeki değişiklikleri izliyor.");
            mevcutObserver = observer;

            const initialElements = element.querySelectorAll('svg, div[style*="color: rgb(113, 118, 123)"]');
            initialElements.forEach(el => guncelleElementStilleri(el, 'başlangıç'));

        } catch (error) {
            console.error("Observer başlatılırken hata:", error);
        }
    }


function guncelleElementStilleri(element, kaynak = 'bilinmiyor') {
    const computedStyle = window.getComputedStyle(element);

    // SVG opaklık kontrolü ve class kaldırma
    if (element instanceof SVGElement && computedStyle.opacity === '0.4') {
        // console.log(`Opaklığı 0.4 olan SVG bulundu (${kaynak}):`, element);
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
            // console.log(`Opaklığı 0.4 olan class siliniyor (${kaynak}):`, element, `Class Adı: ${opacitySifirNoktaDortClass}`);
            element.classList.remove(opacitySifirNoktaDortClass);
        }
    } else if (element instanceof SVGElement && computedStyle && computedStyle.opacity !== '1') {
        // console.log(`Opaklığı 1 olmayan SVG bulundu (${kaynak}):`, element, `Mevcut Opaklık: ${computedStyle.opacity}`);
        element.style.opacity = '1';
    }

    // BUTTON elementinin altındaki elementlerden yukarı doğru arama yap (retweet butonları için)
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
                        console.log(`Alt elementte opaklığı 0.5 olan class bulundu, retweet button opacity 1 yapılıyor (${kaynak}):`, className, parentButton);
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

    // Doğrudan retweet butonlarını kontrol et
    const targetRetweetButton = element.closest('button[data-testid="retweet"]');
    if (targetRetweetButton) {
        const buttonComputedStyle = window.getComputedStyle(targetRetweetButton);
        if (buttonComputedStyle.opacity === '0.5') {
            // console.log(`Doğrudan retweet button stilinde opaklık 0.5 bulundu (${kaynak}):`, targetRetweetButton);
            targetRetweetButton.style.opacity = '1';
        }
    }

    // Doğrudan paylaş butonlarını kontrol et
    const targetShareButton = element.closest('button[aria-label="Gönderiyi paylaş"]');
    if (targetShareButton) {
        const buttonComputedStyle = window.getComputedStyle(targetShareButton);
        if (buttonComputedStyle.opacity === '0.5') {
            // console.log(`Doğrudan paylaş butonu stilinde opaklık 0.5 bulundu (${kaynak}):`, targetShareButton);
            targetShareButton.style.opacity = '1';
        }
    }
}
// Tüm kaynaklar (resimler, stil dosyaları vb.) yüklendikten 2 saniye sonra observer'ı başlat
window.onload = () => {
    setTimeout(baslatObserver, 2000); // 2000 milisaniye = 2 saniye
};

//     window.addEventListener('popstate', () => {
//     console.log("popstate olayı tetiklendi!");
//     if (mevcutObserver) {
//         mevcutObserver.disconnect();
//         mevcutObserver = null;
//     }
//     baslatObserver();
// });

setInterval(() => {
    if (window.location.href !== mevcutUrl || document.querySelector('[aria-label="Zaman Akışı: Sohbet"]') !== hedefElementReferansi) {
        console.log("URL veya hedef element değişti (periyodik kontrol), observer yeniden başlatılıyor.");
        if (mevcutObserver) {
            mevcutObserver.disconnect();
            mevcutObserver = null;
        }
        baslatObserver();
        mevcutUrl = window.location.href;
    }
}, 100); // Her 0.1 saniyede kontrol et (önceki 0.1 saniye)
    // Your code here...
})();