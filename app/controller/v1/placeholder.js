'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');

const { createCanvas } = require('canvas')


module.exports = class extends Controller {
    async index() {
        const { ctx, app } = this;

        const size = ctx.params.size;
        console.log(size);
        let w = 200;
        let h = 200;
        let text = "";
        if (size) {
            let arr = size.toString().toLowerCase().split("x");
            if (arr && arr.length >= 1) {
                w = arr[0];
                if (arr.length >= 2) {
                    h = arr[1];
                } else {
                    h = w;
                }
            } 
        }

        if (!text) {
            text = "Abner";
        }

        console.log(w, h);

        const canvas = await createCanvas(~~w, ~~h)
        const catx = canvas.getContext('2d')
        ctx.strokeStyle = 'rgba(255,0,0,0.5)'
        catx.font = '20px Impact'
        catx.fillText(text, 5, 25)

        catx.font = '15px Impact'
        catx.fillText(w + 'x' + h, 5, 45)

        const stream = await canvas.createPNGStream()

        ctx.set('Content-Disposition', 'attachment;filename=placeholder.png');
        ctx.body = stream;
    }
};