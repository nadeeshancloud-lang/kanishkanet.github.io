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
$formatted_count = sprintf('%06d', $visitor_count);
?>

<div class="counter-wrapper">
    <div class="counter-title">Total Visitors</div>
    <div class="odometer-container" id="odometer">
        </div>
    <div class="counter-footer">
        © 2026 Kanishka Net. All Rights Reserved.
    </div>
</div>

<style>
    .counter-wrapper {
        background: linear-gradient(135deg, #12131a 0%, #0a0b0d 100%);
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        display: inline-block;
        text-align: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .counter-title {
        color: #8a99ad;
        font-size: 16px;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 20px;
        font-weight: 600;
    }
    .odometer-container {
        display: flex;
        justify-content: center;
        background: #000;
        padding: 10px 15px;
        border-radius: 12px;
        box-shadow: inset 0 5px 15px rgba(0,0,0,0.9), 0 0 15px rgba(0, 230, 118, 0.2);
        border: 1px solid #1f232b;
        overflow: hidden;
    }
    .digit-box {
        position: relative;
        width: 35px;
        height: 50px;
        overflow: hidden;
        margin: 0 3px;
        background: linear-gradient(to bottom, #2c303b 0%, #17191d 50%, #0b0c0e 100%);
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.05);
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .digit-sequence {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        transition: transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.1);
        display: flex;
        flex-direction: column;
    }
    .digit {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: bold;
        color: #00e676;
        text-shadow: 0 0 10px rgba(0, 230, 118, 0.6);
    }
    .counter-footer {
        margin-top: 20px;
        color: #556070;
        font-size: 13px;
        letter-spacing: 1px;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        // PHP මඟින් කෙලින්ම Count එක ගන්නවා (Fetch කරන්න ඕන නෑ)
        const countString = "<?php echo $formatted_count; ?>"; 
        const container = document.getElementById('odometer');
        container.innerHTML = '';

        for (let i = 0; i < countString.length; i++) {
            const digitBox = document.createElement('div');
            digitBox.className = 'digit-box';

            const sequence = document.createElement('div');
            sequence.className = 'digit-sequence';

            for (let j = 0; j <= 9; j++) {
                const digit = document.createElement('div');
                digit.className = 'digit';
                digit.innerText = j;
                sequence.appendChild(digit);
            }

            digitBox.appendChild(sequence);
            container.appendChild(digitBox);

            setTimeout(() => {
                const targetDigit = parseInt(countString[i]);
                sequence.style.transform = `translateY(-${targetDigit * 50}px)`;
            }, i * 150);
        }
    });
</script>
