<template>
    <div>
        <!-- TODO: https://stackoverflow.com/questions/31749625/make-a-link-from-electron-open-in-browser -->
        <div class="help-section">
            <h3>P5.js</h3>
            <p>
                The editor is designed to accept P5 (and vanilla JavaScript)
                code. The P5 code must be written in 'Instance Mode', and it
                must include both a <span class="code">setup</span> and
                <span class="code">draw</span> function. For external
                references, see:
            </p>
            <ul>
                <li>General P5: <span class="code">https://p5js.org</span></li>
                <li>
                    P5 Instance Mode:
                    <span class="code"
                        >https://p5js.org/examples/instance-mode-instantiation.html</span
                    >
                </li>
            </ul>
        </div>

        <div class="help-section">
            <h3>Special variables</h3>
            <p>
                A few variables are reserved for MIT Illuminations specifically.
            </p>
            <ul>
                <li>
                    <span class="code">helpers.canvas.width</span>: the
                    recommended canvas width (i.e. 1200 pixels).
                </li>
                <li>
                    <span class="code">helpers.canvas.height</span>: the
                    recommended canvas height (i.e. 100 pixels)
                </li>
                <li>
                    <span class="code">controls.${controlId}.value</span>: see
                    Controls section for more information
                </li>
            </ul>
        </div>

        <div class="help-section">
            <h3>Controls</h3>
            <ul>
                <li>
                    When you create a new control, you will give it a name.
                    E.g.: 'My New Control'.
                </li>
                <li>
                    When you do this, a control id will be generated.
                    Specifically, it will be the camel-case version of the name.
                    In this case:
                    <span class="code">myNewControl</span>.
                </li>
                <li>
                    You can access the control's output value using the pattern
                    <span class="code">controls.${controlId}.value</span>. So in
                    this particular example:
                    <span class="code">controls.myNewControl.value</span>.
                </li>
            </ul>
        </div>
        <div class="help-section">
            <h4>Using a color control</h4>
            <ul>
                <li>
                    If your control is named (for example) 'My Color', you can
                    access it in the code using
                    <span class="code">controls.myColor.value</span>.
                </li>
                <li>
                    The color contol's output is a hex string, like
                    <span class="code">'#FC03E7'</span>.
                </li>
                <li>
                    To see an example of a color control, see the template
                    'Simple Colors'.
                </li>
            </ul>
            <h4>Using a number control</h4>
            <ul>
                <li>
                    If your control is named (for example) 'My Number', you can
                    access it in the code using
                    <span class="code">controls.myNumber.value</span>.
                </li>
                <li>
                    The number contol's output is a number, like
                    <span class="code">10</span>.
                </li>
                <li>
                    To see an example of a number control, see the template
                    Simple Colors'.
                </li>
            </ul>
            <h4>Using an image control</h4>
            <ul>
                <li>
                    If your control is named (for example) 'My Image', you can
                    access it in the code using
                    <span class="code">controls.myImage.value</span>.
                </li>
                <li>
                    The image contol's output is a string containing the
                    uploadoed file's generated id, like
                    <span class="code">LQa1df8kJL</span>.
                </li>
                <li>
                    To load a control image in the code, use the custom
                    <span class="code">p5.loadControlImage</span> function. For
                    example, if your image has an id
                    <span class="code">myImage</span>, you can load the image
                    (and optionally request a callback) using
                    <pre class="code">
        p5.loadControlImage(
            controls.myImage.value,
            console.log('image loaded')
        )</pre
                    >
                </li>
                <li>
                    To see an example of an image control, see the template
                    'Slit-Scan'.
                </li>
            </ul>
        </div>

        <div class="help-section">
            <h3>Console</h3>
            <p>
                The code editor comes with a custom console. Most code errors
                will be caught and raised in the console. Messages can also be
                written to the console via
                <span class="code">console.log()</span> or
                <span class="code">p5.print()</span>.
            </p>
        </div>

        <div class="help-section">
            <h3>Adding a lights annotation layer to your canvas</h3>
            <ul>
                <li>
                    <span class="code">p5.addPreviewAnnotations(color)</span> is
                    a function that can be added at the end of your draw loop to
                    show where the lights will illuminationsSampling from.
                </li>
                <li>
                    To see an example of the annotation layer in use, see the
                    template 'Simple Colors'.
                </li>
            </ul>
        </div>

        <div class="help-section">
            <h3>setInterval() vs p5.draw() loop</h3>
            <p>
                Do not use JavaScript's <span class="code">setInterval()</span>.
                Use p5's <span class="code">p5.draw()</span> instead. The draw
                function is called by the app ~60 times per second by defualt.
                If needed, you can adjust this frame rate using
                <span class="code">p5.frameRate()</span>
                (https://p5js.org/reference/#/p5/frameRate), though it should
                not exceed 60 fps.
            </p>
        </div>

        <div class="help-section">
            <h3>Color Modes</h3>
            <p>
                The sampling logic that sends colors from your code output to
                the lights expects RGB color mode. This is the default p5 color
                mode (https://p5js.org/reference/#/p5/colorMode) If you want to
                change the p5 color mode to perform calculations, you can. But
                you will need to reset to RGB at the end of the draw loop so
                that the final output for each frame is RGB. For example, see
                the template 'Rainbow'.
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelpDesk'
}
</script>

<style scoped>
.help-section {
    padding-bottom: 30px;
}
h3 {
    padding: 0px 0px 10px 0px;
}
h4 {
    padding-top: 5px;
}
.code {
    font-family: monospace;
    color: #e91e63;
}
</style>
