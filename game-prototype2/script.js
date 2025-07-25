(() => {
    const bottomSquare = document.getElementById('bottom-square');
    const ciwsBarrel = document.querySelector('.ciws-barrel');
    // Get all SU-57 plane elements
    const su57PlaneElements = [
        document.getElementById('su57-1'),
        document.getElementById('su57-2'),
        document.getElementById('su57-3')
    ];

    if (!ciwsBarrel || !bottomSquare || su57PlaneElements.some(el => !el)) {
        console.error("Hata: Gerekli HTML elementleri (.ciws-barrel, #bottom-square, .su57-plane) bulunamadı.");
        return;
    }

    const ciwsASound = document.getElementById('ciwsA');
    let isMouseDown = false;
    let shootingInterval;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Score display elements
    const scoreDisplay = document.getElementById('score-display');
    const scoreValue = document.getElementById('score-value');
    let score = 0;

    const updateScore = () => {
        scoreValue.textContent = score;
    };

    // Initialize multiple SU-57 objects
    const su57s = su57PlaneElements.map(element => ({
        element: element,
        x: 0,
        y: 0,
        angle: 0,
        speed: 10,
        turnRate: 0.03,
        targetAngle: 0,
        animationFrameId: null,
        isDestroyed: true, // Start as destroyed so resetAndStartSu57 can initialize them
        maneuverInterval: null,
        currentBankAngle: 0,
        maxBankAngle: Math.PI / 6,
        bankSmoothness: 0.08
    }));

    ciwsASound.addEventListener('timeupdate', () => {
        if (ciwsASound.duration) {
            const playPercentage = (ciwsASound.currentTime / ciwsASound.duration) * 100;
            if (playPercentage >= 90 && isMouseDown) {
                ciwsASound.currentTime = ciwsASound.duration * 0.40;
            }
        }
    });

    // --- Object Pool Implementation for Bullets ---
    const bulletPool = [];
    const MAX_BULLETS = 100;

    function getBulletFromPool() {
        let bullet;
        for (let i = 0; i < bulletPool.length; i++) {
            if (bulletPool[i].style.display === 'none') {
                bullet = bulletPool[i];
                bullet.style.display = 'block';
                bullet.style.opacity = '1';
                bullet.style.transform = '';
                return bullet;
            }
        }
        if (bulletPool.length < MAX_BULLETS) {
            bullet = document.createElement('div');
            bullet.classList.add('ciws-bullet-effect');
            document.body.appendChild(bullet);
            bulletPool.push(bullet);
            return bullet;
        }
        return null;
    }

    function returnBulletToPool(bullet) {
        if (bullet) {
            bullet.style.display = 'none';
            bullet.style.opacity = '0';
            bullet.style.transform = '';
        }
    }
    // --- End Object Pool Implementation ---

    document.addEventListener('mousedown', (e) => {
        if (e.target === ciwsBarrel || e.target === bottomSquare) {
            return;
        }
        isMouseDown = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (ciwsASound.paused) {
            ciwsASound.play().catch(error => console.warn("Ses oynatma engellendi:", error));
        }
        triggerMuzzleFlash(lastMouseX, lastMouseY); // Geri getirildi
        createBullet(lastMouseX, lastMouseY);
        const muzzleTip = getMuzzleTipCoordinates();
        triggerFastShockwave(muzzleTip.x, muzzleTip.y);

        shootingInterval = setInterval(() => {
            if (isMouseDown) {
                triggerMuzzleFlash(lastMouseX, lastMouseY); // Geri getirildi
                createBullet(lastMouseX, lastMouseY);
                const muzzleTip = getMuzzleTipCoordinates();
                triggerFastShockwave(muzzleTip.x, muzzleTip.y);
            }
        }, 10);
    });

    document.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        }
        rotateTurret(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        clearInterval(shootingInterval);
        ciwsASound.pause();
        ciwsASound.currentTime = 0;
    });

    document.addEventListener('dragstart', (e) => e.preventDefault());

    let currentTurretRotation = 0;

    function rotateTurret(mouseX, mouseY) {
        const pivotX = window.innerWidth / 2;
        const pivotY = window.innerHeight - 50 - (150 / 2);
        const deltaX = mouseX - pivotX;
        const deltaY = mouseY - pivotY;
        let angleRad = Math.atan2(deltaX, -deltaY);
        if (angleRad > Math.PI / 2) angleRad = Math.PI / 2;
        else if (angleRad < -Math.PI / 2) angleRad = -Math.PI / 2;
        currentTurretRotation = angleRad;
        const barrelContainer = document.getElementById('bottom-square');
        barrelContainer.style.transform = `rotate(${angleRad}rad)`;
    }

    function getMuzzleTipCoordinates() {
        const pivotX = window.innerWidth / 2;
        const pivotY = window.innerHeight - 50 - (150 / 2);
        const turretRadius = 150 / 2;
        const barrelOffset = Math.abs(parseFloat(getComputedStyle(ciwsBarrel).top));
        const muzzleDistanceFromPivot = turretRadius + barrelOffset;
        const muzzleTipX = pivotX + Math.sin(currentTurretRotation) * muzzleDistanceFromPivot;
        const muzzleTipY = pivotY - Math.cos(currentTurretRotation) * muzzleDistanceFromPivot;
        return { x: muzzleTipX, y: muzzleTipY };
    }

    function triggerMuzzleFlash(targetX, targetY) {
        const muzzleTip = getMuzzleTipCoordinates();
        const muzzleX = muzzleTip.x;
        const muzzleY = muzzleTip.y;

        const deltaX = targetX - muzzleX;
        const deltaY = targetY - muzzleY;
        const angleRad = Math.atan2(deltaY, deltaX);

        // Sarı ateş efekti kod bloğu geri getirildi
        const fireEffect = document.createElement('div');
        fireEffect.classList.add('ciws-fire-effect');
        document.body.appendChild(fireEffect);

        fireEffect.style.left = `${muzzleX}px`;
        fireEffect.style.top = `${muzzleY}px`;

        const spreadDistance = 120;
        const endX = muzzleX + Math.cos(angleRad) * spreadDistance;
        const endY = muzzleY + Math.sin(angleRad) * spreadDistance;

        fireEffect.animate([
            { transform: `translate(-50%, -50%) rotate(${angleRad}rad) translateX(0px)`, opacity: 1, width: '30px', height: '30px' },
            { transform: `translate(-50%, -50%) rotate(${angleRad}rad) translateX(${spreadDistance}px)`, opacity: 0, width: '30px', height: '30px' }
        ], {
            duration: 180,
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = () => fireEffect.remove();

        // Duman partikülleri kod bloğu kaldırıldı
        // Işık partikülleri kod bloğu kaldırıldı
    }

    function createBullet(targetX, targetY) {
        const bullet = getBulletFromPool();
        if (!bullet) {
            console.warn("Bullet pool is full, cannot fire more bullets.");
            return;
        }

        const muzzleTip = getMuzzleTipCoordinates();
        const muzzleX = muzzleTip.x;
        const muzzleY = muzzleTip.y;

        const deltaX = targetX - muzzleX;
        const deltaY = targetY - muzzleY;
        const angleRad = Math.atan2(deltaY, deltaX);

        bullet.style.left = `${muzzleX}px`;
        bullet.style.top = `${muzzleY}px`;

        const bulletSpeed = 2000;
        const distanceToTarget = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const animationDuration = (distanceToTarget / bulletSpeed) * 1000;

        bullet.animate([
            { transform: `translate(-50%, -50%) rotate(${angleRad}rad) translateX(0px)`, opacity: 1, width: '6px', height: '6px' },
            { transform: `translate(-50%, -50%) rotate(${angleRad}rad) translateX(${distanceToTarget}px)`, opacity: 1, width: '6px', height: '6px' }
        ], {
            duration: animationDuration,
            easing: 'linear',
            fill: 'forwards'
        }).onfinish = () => {
            returnBulletToPool(bullet);
            // Calculate the exact final position of the bullet for hit detection
            const finalBulletX = muzzleX + Math.cos(angleRad) * distanceToTarget;
            const finalBulletY = muzzleY + Math.sin(angleRad) * distanceToTarget;

            explode(finalBulletX, finalBulletY); // Explode at the bullet's final position

            // Check for hits on all active SU-57s
            su57s.forEach(su57 => {
                if (!su57.isDestroyed) {
                    checkHit(finalBulletX, finalBulletY, su57);
                }
            });
        };
    }

    function explode(x, y) {
        const numParticles = 10;
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('explosion-particle');
            document.body.appendChild(particle);
            const size = Math.random() * (10 - 3) + 3;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            const angle = Math.random() * 2 * Math.PI;
            const spreadDistance = Math.random() * 50;
            const endX = x + Math.cos(angle) * spreadDistance;
            const endY = y + Math.sin(angle) * spreadDistance;
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
                { transform: `translate(-50%, -50%) translate(${endX - x}px, ${endY - y}px) scale(1.2)`, opacity: 0 }
            ], { duration: 250, easing: 'ease-out', fill: 'forwards' }).onfinish = () => particle.remove();
        }
    }

    function triggerFastShockwave(x, y) {
        const s = document.createElement('div');
        s.className = 'fast-shockwave';
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        document.body.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
    }

    function resetAndStartSu57(su57) {
        if (su57.animationFrameId) {
            cancelAnimationFrame(su57.animationFrameId);
        }
        if (su57.maneuverInterval) {
            clearInterval(su57.maneuverInterval);
        }

        su57.isDestroyed = false;
        su57.element.style.opacity = '1';
        su57.element.style.transition = 'none';

        const planeWidth = su57.element.offsetWidth || su57.element.naturalWidth || 100;
        const planeHeight = su57.element.offsetHeight || su57.element.naturalHeight || 60;
        su57.x = window.innerWidth + planeWidth + (Math.random() * 200); // Stagger initial positions
        su57.y = Math.random() * (window.innerHeight - planeHeight);

        su57.angle = Math.PI;
        su57.targetAngle = su57.angle;

        su57.element.style.transformOrigin = '0 50%';
        su57.element.style.transform = `translate(${su57.x}px, ${su57.y}px) rotate(${su57.angle + Math.PI / 2}rad)`;
        su57.element.getBoundingClientRect();

        su57.maneuverInterval = setInterval(() => {
            const maxVerticalTurn = Math.PI / 2.5;
            const borderBuffer = 150;

            let newTargetAngle;

            if (su57.y < borderBuffer) {
                newTargetAngle = Math.PI - (Math.random() * maxVerticalTurn / 2);
            }
            else if (su57.y > (window.innerHeight - planeHeight - borderBuffer)) {
                newTargetAngle = Math.PI + (Math.random() * maxVerticalTurn / 2);
            }
            else {
                newTargetAngle = Math.PI + (Math.random() - 0.5) * maxVerticalTurn;
            }

            su57.targetAngle = newTargetAngle;
        }, 800 + Math.random() * 700);

        updateSu57State(su57);
    }

    function updateSu57State(su57) {
        if (su57.isDestroyed) {
            // Do not update destroyed planes
            return;
        }

        const planeHeight = su57.element.offsetHeight || su57.element.naturalHeight || 60;
        const anticipationDistance = 100;

        let targetAngle = su57.targetAngle;

        if (su57.y < anticipationDistance) {
            const proximity = su57.y / anticipationDistance;
            const turnStrength = (1 - proximity);
            targetAngle = Math.PI - (turnStrength * Math.PI / 4);
        }
        else if (su57.y > window.innerHeight - planeHeight - anticipationDistance) {
            const proximity = (window.innerHeight - planeHeight - su57.y) / anticipationDistance;
            const turnStrength = (1 - proximity);
            targetAngle = Math.PI + (turnStrength * Math.PI / 4);
        }

        const angleDifference = (targetAngle - su57.angle + Math.PI) % (2 * Math.PI) - Math.PI;
        su57.angle += angleDifference * su57.turnRate;

        su57.x += Math.cos(su57.angle) * su57.speed;
        su57.y += Math.sin(su57.angle) * su57.speed;

        if (su57.y < 0) {
            su57.y = 0;
        } else if (su57.y > (window.innerHeight - planeHeight)) {
            su57.y = window.innerHeight - planeHeight;
        }

        const visualAngle = su57.angle + Math.PI / 2;

        let bankAngleDifference = su57.angle - targetAngle;
        bankAngleDifference = (bankAngleDifference + Math.PI) % (2 * Math.PI) - Math.PI;

        let targetBankAngle = bankAngleDifference * 1.5;
        targetBankAngle = Math.max(-su57.maxBankAngle, Math.min(su57.maxBankAngle, targetBankAngle));

        su57.currentBankAngle += (targetBankAngle - su57.currentBankAngle) * su57.bankSmoothness;

        su57.element.style.transformOrigin = '0 50%';
        su57.element.style.transform = `
            translate(${su57.x}px, ${su57.y}px)
            rotate(${visualAngle}rad)
            rotateZ(${-su57.currentBankAngle}rad)
        `;

        const planeWidth = su57.element.offsetWidth || su57.element.naturalWidth || 100;
        const buffer = planeWidth + 50;
        if (su57.x < -buffer) {
            su57.x = window.innerWidth + planeWidth;
            su57.y = Math.random() * (window.innerHeight - planeHeight);
            su57.angle = Math.PI;
            su57.targetAngle = su57.angle;
            su57.currentBankAngle = 0;
        }

        su57.animationFrameId = requestAnimationFrame(() => updateSu57State(su57));
    }

    function checkHit(bulletX, bulletY, su57) {
        const su57Rect = su57.element.getBoundingClientRect();

        // Add a small buffer to the hit area for easier aiming
        const hitBuffer = 10; 

        if (bulletX >= su57Rect.left - hitBuffer && bulletX <= su57Rect.right + hitBuffer &&
            bulletY >= su57Rect.top - hitBuffer && bulletY <= su57Rect.bottom + hitBuffer) {

            if (su57.isDestroyed) return; // Prevent multiple hits on the same plane

            console.log("Su-57 vuruldu!");
            su57.isDestroyed = true;
            score++; // Increment score
            updateScore(); // Update score display

            if (su57.animationFrameId) cancelAnimationFrame(su57.animationFrameId);
            if (su57.maneuverInterval) clearInterval(su57.maneuverInterval);

            explodeSu57(su57Rect.left + su57Rect.width / 2, su57Rect.top + su57Rect.height / 2, su57);
            triggerThermobaricShockwave(su57Rect.left + su57Rect.width / 2, su57Rect.top + su57Rect.height / 2);

            su57.element.style.opacity = '0';

            const respawnTime = 1500 + Math.random() * 1000;
            setTimeout(() => resetAndStartSu57(su57), respawnTime);
        }
    }

    function explodeSu57(x, y, su57) {
        const su57Rect = su57.element.getBoundingClientRect();
        const planeImg = su57.element;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = planeImg.naturalWidth || planeImg.offsetWidth;
        canvas.height = planeImg.naturalHeight || planeImg.offsetHeight;

        ctx.drawImage(planeImg, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const fragmentSize = 3;
        const maxFragments = 200;
        const fragmentCreationInterval = 6;
        let fragmentsCreated = 0;

        for (let py = 0; py < canvas.height; py += fragmentCreationInterval) {
            for (let px = 0; px < canvas.width; px += fragmentCreationInterval) {
                if (fragmentsCreated >= maxFragments) break;

                const index = (py * canvas.width + px) * 4;
                const alpha = pixels[index + 3];

                if (alpha > 0) {
                    const fragment = document.createElement('div');
                    fragment.classList.add('su57-fragment');
                    document.body.appendChild(fragment);

                    const fragmentWorldX = su57Rect.left + px * (su57Rect.width / canvas.width);
                    const fragmentWorldY = su57Rect.top + py * (su57Rect.height / canvas.height);

                    const size = Math.random() * fragmentSize + 1;
                    fragment.style.width = `${size}px`;
                    fragment.style.height = `${size}px`;

                    const r = pixels[index];
                    const g = pixels[index + 1];
                    const b = pixels[index + 2];
                    fragment.style.backgroundColor = `rgb(${r},${g},${b})`;
                    fragment.style.borderRadius = `${Math.random() * 50}%`;

                    fragment.style.left = `${fragmentWorldX}px`;
                    fragment.style.top = `${fragmentWorldY}px`;

                    const angle = Math.random() * 2 * Math.PI;
                    const spreadDistance = Math.random() * 150 + 50;
                    const endX = fragmentWorldX + Math.cos(angle) * spreadDistance;
                    const endY = fragmentWorldY + Math.sin(angle) * spreadDistance;
                    const rotation = Math.random() * 720 - 360;
                    const duration = 400 + Math.random() * 200;

                    fragment.animate([
                        { transform: `translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1)`, opacity: 1 },
                        { transform: `translate(-50%, -50%) translate(${endX - fragmentWorldX}px, ${endY - fragmentWorldY}px) rotate(${rotation}deg) scale(0)`, opacity: 0 }
                    ], {
                        duration: duration,
                        easing: 'ease-out',
                        fill: 'forwards'
                    }).onfinish = () => fragment.remove();

                    fragmentsCreated++;
                }
            }
            if (fragmentsCreated >= maxFragments) break;
        }
        // Remove the canvas after use
        canvas.remove();
    }


    function triggerThermobaricShockwave(x, y) {
        const shockwave = document.createElement('div');
        shockwave.className = 'shockwave-effect';
        shockwave.style.left = `${x}px`;
        shockwave.style.top = `${y}px`;
        document.body.appendChild(shockwave);
        shockwave.addEventListener('animationend', () => shockwave.remove());
    }

    const initializeGame = () => {
        updateScore(); // Display initial score
        su57s.forEach(su57 => {
            // Set initial position far off-screen to ensure proper entry animation
            su57.element.style.transform = `translate(${window.innerWidth * 2}px, ${Math.random() * (window.innerHeight - (su57.element.offsetHeight || 60))}px) rotate(${Math.PI / 2}rad)`;
            su57.element.style.transition = 'none';

            // Wait for next frame to ensure styles are applied, then start
            requestAnimationFrame(() => {
                resetAndStartSu57(su57);
            });
        });
    };

    // Initialize all SU-57s once all images are loaded
    let loadedCount = 0;
    su57PlaneElements.forEach(plane => {
        if (plane.complete && plane.naturalWidth > 0) {
            loadedCount++;
        } else {
            plane.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === su57PlaneElements.length) {
                    initializeGame();
                }
            });
        }
    });

    // Fallback if images are already cached or load very fast
    if (loadedCount === su57PlaneElements.length) {
        initializeGame();
    } else if (loadedCount === 0 && su57PlaneElements.length > 0) {
        // If no images loaded immediately, set a timeout in case load events are missed
        setTimeout(() => {
            if (loadedCount < su57PlaneElements.length) {
                console.warn("SU-57 image load events did not fire for all planes or were too slow. Attempting to force start.");
                initializeGame();
            }
        }, 1000); // 1 second fallback
    }

})();