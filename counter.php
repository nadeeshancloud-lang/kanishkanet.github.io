<?php
// counter.txt ගොනුව පරීක්ෂා කර අගය කියවීම
$file = 'counter.txt';

if (!file_exists($file)) {
    file_put_contents($file, '0');
}

$count = (int)file_get_contents($file);

// සෙස්සන් (Session) එකක් හරහා එකම පුද්ගලයා Refresh කරන විට Count එක වැඩිවීම වැළැක්වීම
session_start();
if (!isset($_SESSION['has_visited'])) {
    $_SESSION['has_visited'] = true;
    $count++;
    file_put_contents($file, $count);
}

// අගය පෙන්වීම (Digits 6ක් ලෙස Format කිරීම, උදා: 007833)
echo sprintf('%06d', $count);
?>
