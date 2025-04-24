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

let mevcutObserver = null;
let mevcutUrl = window.location.href;
let hedefElementReferansi = null;
let hedefElement = null;
let timeoutId;

function baslatObserver() {
    let hedefElement = document.querySelector('[aria-label^="Zaman Akışı:"]');
    hedefElementReferansi = hedefElement;
    if (hedefElement) {
        kurObserver(hedefElement);
        setInterval(kontrolAltElementleri, 1500); // Aralık artırıldı (1.5 saniye)
    } else {
        const intervalId = setInterval(() => {
            hedefElement = document.querySelector('[aria-label^="Zaman Akışı:"]');
            hedefElementReferansi = hedefElement;
            if (hedefElement) {
                clearInterval(intervalId);
                kurObserver(hedefElement);
            }
        }, 1000); // Aralık artırıldı (1 saniye)
    }
}

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
    }, 300); // Gecikme biraz artırıldı
}

function kurObserver(element) {
    if (mevcutObserver) {
        mevcutObserver.disconnect();
        mevcutObserver = null;
    }

    const observer = new MutationObserver(handleMutations);

    try {
        observer.observe(element, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style'] });
        // console.log("Observer aktif, 'Zaman Akışı: Sohbet' içindeki değişiklikleri izliyor.");
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
        const opacitySifirNoktaDortPrefix = 'opacity-0\\.4'; // Daha spesifik class arama
        element.classList.forEach(className => {
            if (className.includes(opacitySifirNoktaDortPrefix)) {
                element.classList.remove(className);
                // console.log(`Opaklığı 0.4 olan class silindi (${kaynak}):`, element, `Class Adı: ${className}`);
            }
        });
    } else if (element instanceof SVGElement && computedStyle && computedStyle.opacity !== '1') {
        element.style.opacity = '1';
    }

    let currentElement = element;
    while (currentElement && currentElement.nodeName.toLowerCase() !== 'button') {
        if (currentElement instanceof HTMLElement) {
            const opacitySifirNoktaBesPrefix = 'opacity-0\\.5';
            currentElement.classList.forEach(className => {
                if (className.includes(opacitySifirNoktaBesPrefix)) {
                    const parentButton = currentElement.closest('button[data-testid="retweet"]');
                    if (parentButton && window.getComputedStyle(parentButton).opacity === '0.5') {
                        parentButton.style.opacity = '1';
                        return;
                    }
                    const parentShareButton = currentElement.closest('button[aria-label="Gönderiyi paylaş"]');
                    if (parentShareButton && window.getComputedStyle(parentShareButton).opacity === '0.5') {
                        parentShareButton.style.opacity = '1';
                        return;
                    }
                }
            });
        }
        currentElement = currentElement.parentNode;
    }

    const targetRetweetButton = element.closest('button[data-testid="retweet"]');
    if (targetRetweetButton && window.getComputedStyle(targetRetweetButton).opacity === '0.5') {
        targetRetweetButton.style.opacity = '1';
    }

    const targetShareButton = element.closest('button[aria-label="Gönderiyi paylaş"]');
    if (targetShareButton && window.getComputedStyle(targetShareButton).opacity === '0.5') {
        targetShareButton.style.opacity = '1';
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
    if (window.location.href !== mevcutUrl || document.querySelector('[aria-label^="Zaman Akışı:"]') !== hedefElementReferansi) {
        // console.log("URL veya hedef element değişti (periyodik kontrol), observer yeniden başlatılıyor.");
        if (mevcutObserver) {
            mevcutObserver.disconnect();
            mevcutObserver = null;
        }
        baslatObserver();
        mevcutUrl = window.location.href;
    }
}, 100);
    // Your code here...
})();
