
function confirmOperartion(type, parent) {
    let Confirmation = document.createElement('div');
    if (type === 'copy') {
        document.getElementById('copyConfirm') ? parent.removeChild(document.getElementById('copyConfirm')) : null;
        Confirmation.id = 'copyConfirm';
        Confirmation.innerHTML = ' Copied to clipboard!';
        Confirmation.classList.add('nokora', 'text-white');
        Confirmation.style.fontSize = '0.5rem';
        parent.appendChild(Confirmation);
        setTimeout(() => {
            parent.removeChild(Confirmation);
        }, 1000);
    }
}


function loadEvents() {
    let items = document.querySelectorAll('input');
    items.forEach(item => {
        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter')
                console.log('Enter key pressed');
        });
    });
    window.addEventListener('popstate', router);
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            history.pushState(null, null, this.href);
            router();
        });
    });
    // Profile Page
    let cpyID = document.getElementById('cpyID');
    if (cpyID) {
        cpyID.addEventListener('click', function () {
            let copyText = document.getElementById('player_id');
            navigator.clipboard.writeText(copyText.innerHTML);
            confirmOperartion('copy', copyText.parentElement);

        });
    }
    // Settings Page
    let uploadBG = document.getElementById('uploadBG');
    let uploadPFP = document.getElementById('uploadPFP');
    let fileInputBg = document.createElement('input');
    let fileInputPfp = document.createElement('input');
    fileInputBg.type = 'file';
    fileInputPfp.type = 'file';
    if (uploadBG && uploadPFP) {
        uploadBG.addEventListener('click', function () {
            fileInputBg.click();
            if (fileInputBg.files) {
                // TO BE FURTHER IMPLEMENTED
            }

        });
        uploadPFP.addEventListener('click', function () {
            fileInputPfp.click();
            if (fileInputPfp.files) {
                // TO BE FURTHER IMPLEMENTED
            }
        });
    }
    let Offbtn = document.getElementById('offBtn');
    let Onbtn = document.getElementById('onBtn');
    if (Offbtn && Onbtn) {
        Offbtn.addEventListener('click', function () {
            Offbtn.setAttribute('fill', 'white');
            Offbtn.setAttribute('x', '7');
            Offbtn.setAttribute('y', '23');
            Offbtn.setAttribute('font-size', '17');
            //=====//
            Onbtn.setAttribute('fill', 'grey');
            Onbtn.setAttribute('x', '7');
            Onbtn.setAttribute('y', '23');
            Onbtn.setAttribute('font-size', '16');
            //=====//
            Onbtn.classList.remove('text-glow');
            Offbtn.classList.add('text-glow');
        });
        Onbtn.addEventListener('click', function () {
            Onbtn.setAttribute('fill', 'white');
            Onbtn.setAttribute('x', '7');
            Onbtn.setAttribute('y', '23');
            Onbtn.setAttribute('font-size', '17');
            //=====//
            Offbtn.setAttribute('fill', 'grey');
            Offbtn.setAttribute('x', '7');
            Offbtn.setAttribute('y', '23');
            Offbtn.setAttribute('font-size', '16');
            //=====//
            Offbtn.classList.remove('text-glow');
            Onbtn.classList.add('text-glow');

        });
    }
    Click();
    Click_1();
    // Dashboard Page
    GenerateChart();

}

function Click() {
    let id_open = document.getElementById('#open_id');
    let id_close = document.getElementById('#close_id');
    let blur_id = document.getElementById('#blur_id');
    let menu_items = document.getElementById('#menu_items');

    if (id_open && id_close && blur_id) {
        id_open.addEventListener('click', function () {
            console.log(window)
            id_open.classList.add('d-none');
            id_close.classList.remove('d-none');
            blur_id.style.filter = 'blur(2px)';
            menu_items.classList.remove('d-none');
         });
        id_close.addEventListener('click', function () {
            id_open.classList.remove('d-none');
            id_close.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            menu_items.classList.add('d-none');
 
        });
        window.addEventListener('resize', function () {
            console.log("object")
            id_open.classList.remove('d-none');
            id_close.classList.add('d-none');
            blur_id.style.filter = 'blur(0px)';
            menu_items.classList.add('d-none');
 
        })
    }

    let id_open_1 = document.getElementById('#open_id_1');
    let id_close_1 = document.getElementById('#close_id_1');
    let blur_id_1 = document.getElementById('#blur_id_1');
    let menu_items_1 = document.getElementById('#menu_items_1');
    let list_member = document.getElementById('#list_member');
    let id_open_2 = document.getElementById('#open_id_2');
    let id_close_2 = document.getElementById('#close_id_2');
    if(id_open_2){
        id_open_2.addEventListener('click', function(){
            list_member.classList.remove('d-none');
        });
        id_close_2.addEventListener('click', function(){
            list_member.classList.add('d-none');
        });
    }
    if (id_open_1 && id_close_1 && blur_id_1) {
        id_open_1.addEventListener('click', function () {
             id_open_1.classList.add('d-none');
            id_close_1.classList.remove('d-none');
            blur_id_1.style.filter = 'blur(2px)';
            menu_items_1.classList.remove('d-none');
        });
        id_close_1.addEventListener('click', function () {
            id_open_1.classList.remove('d-none');
            id_close_1.classList.add('d-none');
            blur_id_1.style.filter = 'blur(0px)';
            menu_items_1.classList.add('d-none');
            list_member.classList.add('d-none');
        });
        window.addEventListener('resize', function () {
            id_open_1.classList.remove('d-none');
            id_close_1.classList.add('d-none');
            blur_id_1.style.filter = 'blur(0px)';
            menu_items_1.classList.add('d-none');
            list_member.classList.add('d-none');

        })

        // to keep scroll position in bottom
        let scroll_bottom = document.getElementById("#items-right-center-bottom");
        if (scroll_bottom) {
            console.log(scroll_bottom.scrollHeight, scroll_bottom.scrollTop, scroll_bottom.clientHeight)
            scroll_bottom.scrollTop = scroll_bottom.scrollHeight;
        }

    }
}

function findHighiestGrade(matches) {
    let highiest = 0;
    for ([key, value] of Object.entries(matches)) {
        if (value['won'] > highiest) {
            highiest = value['won'];
        }
    }
    return highiest;

}

class Chart {
    constructor(canvasID, backgroundColor = '#1F1F1F') {
        this.canvas = canvasID;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.prev_x = -1;
        this.prev_y = -1;
        this.prev_lost_x = -1;
        this.prev_lost_y = -1;
    }
    drawTable(lelem, lcolor, melem, mcolor, relem, rcolor, font_size) {
        this.ctx.font = font_size + ' System-ui';
        this.ctx.fillStyle = lcolor;
        this.ctx.fillText(lelem, this.canvas.width * 0.060, this.canvas.height * 0.075);
        this.ctx.fillStyle = rcolor;
        this.ctx.fillText(relem, this.canvas.width * 0.875, this.canvas.height * 0.075);
        this.ctx.font = '12px System-ui';
        this.ctx.fillStyle = mcolor;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(melem, this.canvas.width * 0.5, this.canvas.height * 0.075);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width * 0.10, this.canvas.height * 0.10);
        this.ctx.lineTo(this.canvas.width * 0.10, this.canvas.height * 0.90);
        this.ctx.lineTo(this.canvas.width * 0.90, this.canvas.height * 0.90);
        this.ctx.lineTo(this.canvas.width * 0.90, this.canvas.height * 0.10);
        this.ctx.strokeStyle = "grey";
        this.ctx.stroke();
    }
    /**
     * Function to draw the left grades of the chart use singular to draw the grades in a singular pattern (1,2,3) or multiple (2,4,6)
     * use right or left in side argument to define the which side of the grades will start to render
     * @param {Number} min
     * @param {Number} max
     * @param {String} side
     * @returns Nothing
    */
    drawGrade(min, max, side = 'left') {
        for (let i = min; i < max; i++) {
            this.ctx.baseLine = 'middle';
            // this.ctx.fillStyle = 'grey'; 
            this.ctx.fillText(
                i,
                this.canvas.width * (side == 'left' ? 0.060 : side == 'right' ? 0.95 : null),
                this.canvas.height * 0.90 - (this.canvas.height * 0.80 / (max - min)) * (i - min)
            );
        }
    }
    drawGradeNet(nSidetimes, underSideTimes, color) {
        for (let i = 0; i < nSidetimes; i++) {
            this.drawLine(
                this.canvas.width * 0.10, // x
                this.canvas.height * 0.90 - (this.canvas.height * 0.80 / nSidetimes) * (i + 1), //y
                this.canvas.width * 0.90, //x2
                this.canvas.height * 0.90 - (this.canvas.height * 0.80 / nSidetimes) * (i + 1), //y2
                color
            );
        }
        for (let i = 0; i < underSideTimes; i++) {
            if (i != 0) {
                this.drawLine(
                    this.canvas.width * 0.10 + (this.canvas.width * 0.80 / underSideTimes) * i,
                    this.canvas.height * 0.90,
                    this.canvas.width * 0.10 + (this.canvas.width * 0.80 / underSideTimes) * i,
                    this.canvas.height * 0.10,
                    color
                )

            }
        }

    }
    /**
     * Draws a simple line in the canvas
     * @param {int} x1 
     * @param {int} y1 
     * @param {int} x2 
     * @param {int} y2 
     * @param {string} color 
     */
    drawLine(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
    drawCircle(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    drawBar(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    drawUnderSideGrade(min, max) {
        for (let i = min; i <= max; i++) {
            if (i != 0) {
                this.ctx.fillStyle = 'grey';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    i,
                    this.canvas.width * 0.1 + (this.canvas.width * 0.80 / max - 1.25) * (i * 1.065),
                    this.canvas.height * 0.95
                );
            }
        }
    }
    drawDot(x, y, color) {
        this.ctx.beginPath();
        x > this.canvas.width * 0.90 ? x = this.canvas.width * 0.90 : null;
        y > this.canvas.height * 0.90 ? y = this.canvas.height * 0.90 : null;
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}

function GenerateChart() {
    let matches = {
        'Matches': {
            '1': {
                'won': 4,
                'lost': 2
            },
            '2': {
                'won': 3,
                'lost': 1
            },
            '3': {
                'won': 5,
                'lost': 3
            },
            '4': {
                'won': 6,
                'lost': 4
            },
            '5': {
                'won': 1,
                'lost': 5
            },
            '6': {
                'won': 13,
                'lost': 6
            },
            '7': {
                'won': 9,
                'lost': 7
            },
            '8': {
                'won': 3,
                'lost': 8
            },
            '9': {
                'won': 2,
                'lost': 9
            },
            '10': {
                'won': 5,
                'lost': 10
            },
            '11': {
                'won': 9,
                'lost': 11
            },
            '12': {
                'won': 8,
                'lost': 12
            },
            '13': {
                'won': 6,
                'lost': 13
            }
        }
    };
    const length = Object.keys(matches['Matches']).length;
    let chart = new Chart(document.getElementById('myCanvas'), 'white');
    heighest = findHighiestGrade(matches['Matches']);
    chart.drawTable('Won', 'green', 'Matches/Day', 'grey', 'Lost', 'red', '12px');
    chart.drawGrade(0, heighest, 'right');
    chart.drawGrade(0, heighest, 'left');
    chart.drawUnderSideGrade(0, length);
    chart.drawGradeNet(length, length, 'grey');

    for ([key, value] of Object.entries(matches['Matches'])) {
        if (this.prev_x != -1 && this.prev_y != -1 && this.prev_lost_x != -1 && this.prev_lost_y != -1) {
            chart.drawLine(
                chart.canvas.width * 0.10 + (chart.canvas.width * 0.80 / length) * key,
                chart.canvas.height * 0.90 - (chart.canvas.height * 0.80 / length) * value['won'],
                this.prev_x,
                this.prev_y,
                'green'
            );
            chart.drawLine(
                chart.canvas.width * 0.10 + (chart.canvas.width * 0.80 / length) * key,
                chart.canvas.height * 0.90 - (chart.canvas.height * 0.80 / length) * value['lost'],
                this.prev_lost_x,
                this.prev_lost_y,
                'red'
            );
        }
        chart.drawDot(
            chart.canvas.width * 0.10 + (chart.canvas.width * 0.80 / length) * key,
            chart.canvas.height * 0.90 - (chart.canvas.height * 0.80 / length) * value['won'],
            'green'
        );
        chart.drawDot(
            chart.canvas.width * 0.10 + (chart.canvas.width * 0.80 / length) * key,
            chart.canvas.height * 0.90 - (chart.canvas.height * 0.80 / length) * value['lost'],
            'red'
        );
        prev_x = chart.canvas.width * 0.10 + (chart.canvas.width * 0.80 / length) * key;
        prev_y = chart.canvas.height * 0.90 - (chart.canvas.height * 0.80 / length) * value['won'];

        prev_lost_x = chart.canvas.width * 0.10 + (chart.canvas.width * 0.80 / length) * key;
        prev_lost_y = chart.canvas.height * 0.90 - (chart.canvas.height * 0.80 / length) * value['lost'];
    }
    // let CurrentDate = new Date();
    // console.log(CurrentDate.getMonth());
}