((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);

window.innerHeight
window.pageYOffset
window.scrollY
document.body.clientHeight
document.body.scrollTop
document.body.scrollHeight
document.body.offsetHeight
document.documentElement.scrollHeight
document.documentElement.offsetHeight
document.documentElement.clientHeight
document.documentElement.scrollTop
document.documentElement.scrollHeight
document.documentElement.clientHeight

<html>
<body>
<script language="JavaScript">
document.write("Screen Resolution: ")
document.write(screen.width + "*")
document.write(screen.height + "<br>")
document.write("Available View Area: ")
document.write(window.screen.availWidth + "*")
document.write(window.screen.availHeight + "<br>")
document.write("Color Depth: ")
document.write(window.screen.colorDepth + "<br>")
</script>
</body>
</html>

