<?php
// --- 1. BACKEND කොටස (මෙතනම Count එක සිදු වේ) ---
$counter_file = 'counter.txt';
if (!file_exists($counter_file)) {
    file_put_contents($counter_file, '0');
}
$visitor_count = (int)file_get_contents($counter_file);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['has_visited_kanishka'])) {
    $_SESSION['has_visited_kanishka'] = true;
    $visitor_count++;
    file_put_contents($counter_file, $visitor_count);
}
// ඉලක්කම් 5ක් ලෙස Format කිරීම (උදා: 07833)
$formatted_count = sprintf('%05d', $visitor_count);
?>

<div class="digital-counter-box">
    <div class="counter-header">TOTAL VISITORS</div>
    
    <div class="digital-display" id="digital-display">
        </div>

    <div class="counter-footer">
        © 2026 Kanishka Net. All Rights Reserved.
    </div>
</div>

<style>
    /* මුළු මීටරයේම පසුබිම */
    .digital-counter-box {
        background: #0d0f13;
        border: 2px solid #1a1f29;
        border-radius: 16px;
        padding: 25px 35px;
        display: inline-block;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(0, 242, 254, 0.05);
        font-family: 'Courier New', Courier, monospace; /* Digital පෙනුම සඳහා */
    }

    .counter-header {
        color: #65758d;
        font-size: 13px;
        letter-spacing: 4px;
        margin-bottom: 15px;
        font-weight: bold;
    }

    /* ඩිජිටල් තිරය */
    .digital-display {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #05070a;
        padding: 15px 20px;
        border-radius: 10px;
        border: 1px solid #161b26;
        box-shadow: inset 0 4px 10px rgba(0,0,0,0.9);
    }

    /* එක් ඩිජිටල් කොටුවක් (Calendar Block) */
    .flip-card {
        width: 42px;
        height: 60px;
        background: linear-gradient(to bottom, #1e2530 50%, #151a22 50%); /* මැදින් ඉරක් ඇති පෙනුම */
        border-radius: 6px;
        margin: 0 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: 900;
        color: #00f2fe; /* දීප්තිමත් Digital සයන්/නිල් පැහැය */
        text-shadow: 0 0 12px rgba(0, 242, 254, 0.6);
        box-shadow: 0 5px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        border: 1px solid #242c3a;
        position: relative;
        overflow: hidden;
    }

    /* පියන්පත් දෙක වෙන් කරන මැද ඉර තද කිරීම */
    .flip-card::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        background: rgba(0, 0, 0, 0.4);
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    /* මැද තියෙන බෙදුම් තිත් සලකුණ ( : ) */
    .digital-colon {
        font-size: 36px;
        font-weight: bold;
        color: #394557; /* තරමක් අඳුරු පැහැයක් */
        margin: 0 2px;
        animation: blinker 1.5s linear infinite; /* දිනදර්ශන වගේ නිවි නිවි පත්තුවීමට */
        text-shadow: 0 0 8px rgba(57, 69, 87, 0.5);
    }

    @keyframes blinker {
        50% { opacity: 0.3; }
    }

    /* කැරකෙන (Flip) Animation එක */
    .flip-animate {
        animation: flipEffect 0.6s ease-in-out;
    }

    @keyframes flipEffect {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(90deg); opacity: 0.5; }
        100% { transform: rotateX(0deg); }
    }

    .counter-footer {
        margin-top: 18px;
        color: #414d61;
        font-size: 11px;
        letter-spacing: 1px;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // PHP මඟින් ලැබෙන ඉලක්කම් 5 (උදා: "07833")
        const countString = "<?php echo $formatted_count; ?>"; 
        const display = document.getElementById('digital-display');
        display.innerHTML = ''; // පැරණි දත්ත ඉවත් කිරීම

        for (let i = 0; i < countString.length; i++) {
            // ඩිජිටල් කොටුව සෑදීම
            const card = document.createElement('div');
            card.className = 'flip-card';
            card.innerText = countString[i];
            display.appendChild(card);

            // පිටුවට එද්දීම ලස්සනට Flip වී පෙන්වීමට
            setTimeout(() => {
                card.classList.add('flip-animate');
            }, i * 100);

            // අවසාන ඉලක්කම හැර හැම ඉලක්කමකටම පස්සේ " : " සලකුණ දැමීම
            if (i < countString.length - 1) {
                const colon = document.createElement('div');
                colon.className = 'digital-colon';
                colon.innerText = ':';
                display.appendChild(colon);
            }
        }
    });
</script>
