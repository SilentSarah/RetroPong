/****************************************************
*     ██████  ▄▄▄       ██▀███   ▄▄▄       ██░ ██   *
*   ▒██    ▒ ▒████▄    ▓██ ▒ ██▒▒████▄    ▓██░ ██▒  *
*   ░ ▓██▄   ▒██  ▀█▄  ▓██ ░▄█ ▒▒██  ▀█▄  ▒██▀▀██░  *
*     ▒   ██▒░██▄▄▄▄██ ▒██▀▀█▄  ░██▄▄▄▄██ ░▓█ ░██   *
*   ▒██████▒▒ ▓█   ▓██▒░██▓ ▒██▒ ▓█   ▓██▒░▓█▒░██▓  *
*   ▒ ▒▓▒ ▒ ░ ▒▒   ▓▒█░░ ▒▓ ░▒▓░ ▒▒   ▓▒█░ ▒ ░░▒░▒  *
*   ░ ░▒  ░ ░  ▒   ▒▒ ░  ░▒ ░ ▒░  ▒   ▒▒ ░ ▒ ░▒░ ░  *
*   ░  ░  ░    ░   ▒     ░░   ░   ░   ▒    ░  ░░ ░  *
*         ░        ░  ░   ░           ░  ░ ░  ░  ░  *
*                All Rights Reserved                *
*                        1337                       *
*****************************************************/

/**
 * @class SSChart
 * @description - Class for creating a simple bar chart with popOvers
 * @param {Object} Data - Dictionary Containing Data to be used for the chart
 * @param {String} Title - Title Of The Chart
 * @param {String} Path - Path to the HTML file containing skeleton holders for the container
 */
class SSChart {
    /**
     * @param {Object} Data - Dictionary Containing Data to be used for the chart
     * @param {String} Title - Title Of The Chart
     * @param {String} Path - Path to the HTML file containing the chart
     * 
     * Data Dictionary should be Structered as follows:
     * {
     *     Title: {
     *      "Date": Value,
     *   }
     */
    constructor (Data, Title, Path) {
        this.ChartData = Data;
        this.Title = Title;
        this.Component = this.LoadChartComponent(Path);
        this.ExtractedData = Object.entries(this.ChartData[this.Title]);
        this.MaxValue = this.findMaxValue();
        this.MinValue = this.findMinValue();

    }
    /**
     * Grabs Graph Skeleton from the server
     * @param {String} path - The path to the file to be grabbed
     * @returns {String} - The content of the file
     */
    async LoadChartComponent(path) {
        const response = await fetch(path);
        if (!response.ok) {
            return await grabContent('/404.html');
        }
        const data = await response.text();
        return data;
    }    
    /**
     * Handles Conversion of Numbers to a more readable format
     * @param {Number} Value 
     */
    HandleConversion(value) {
        if (value >= 1000000)
            return `${parseFloat(value / 1000000).toFixed(1)}M`;
        else if (value >= 1000)
            return `${(value / 1000).toFixed(1)}K`;
        else
            return value;
    }
    /**
     * Listens to mouse click event on the bar
     * @param {HTMLElement} bar 
     */
    ListenToMouseClick(bar) {
        bar.addEventListener('click', () => {
            if (bar.getAttribute('ClickedOn') === 'false') {
                let popOver = document.createElement('div');
                popOver.classList.add('position-absolute', "p-2", "text-white", "text-center" , "nokora", "fw-light", "rounded-2", "fade_in", "border", "rounded", "bg-dark");
                popOver.style.width = "60px";
                popOver.style.top = `${bar.offsetTop - 50}px`;
                popOver.style.left = `${bar.offsetLeft -17}px`;
                popOver.innerHTML = this.HandleConversion(bar.getAttribute('Matches'));
                bar.parentElement.appendChild(popOver);
                bar.setAttribute('ClickedOn', 'true');
                setTimeout(() => {
                    popOver.classList.remove('fade_in');
                    setTimeout(() => {
                        bar.setAttribute('ClickedOn', 'false');
                        popOver.remove();
                    }, 500);
                }, 2000);
            }
        });
    }
    /**
     * Finds the maximum value in the data
     * @returns {Number} - The Maximum Value
     * 
     */
    findMaxValue() {
        let max = 0;
        for (let i = 0; i < this.ExtractedData.length; i++) {
            if (this.ExtractedData[i][1] > max) {
                max = this.ExtractedData[i][1];
            }
        }
        return max;
    }
    /**
     * Finds the minimum value in the data
     * @returns {Number} - The Minimum Value
     */
    findMinValue() {
        let min = this.MaxValue;
        for (let i = 0; i < this.ExtractedData.length; i++) {
            if (this.ExtractedData[i][1] < min) {
                min = this.ExtractedData[i][1];
            }
        }
        return min;
    }
    /**
     * Renders Chart Title to the DOM
     * @param {String} container - The ID of the container to render the chart to
     */
    setChartTitle() {
        let ChartTitle = document.getElementById('ChartTitle');
        ChartTitle.innerHTML = this.Title;
    }
    /**
     * Renders Grades to the DOM
     * @param {String} container - The ID of the container to render the chart to
     */
    setGrades() {
        let GradesContainer = document.getElementById('GradeContainer');
        const DefaultGrade = 120;
        const tens = this.MaxValue % 100;
        const closest_hundred = tens > 50 ? (this.MaxValue - tens) + 100 : this.MaxValue - tens;
        const slice = closest_hundred / 5;

        for (let i = 0; i < 6; i++) {
            let grade = document.createElement('div');
            grade.classList.add("grade", "justify-content-end", "nokora", "fw-light", "m-0");
            grade.innerHTML = 100 - (20 * i);
            GradesContainer.appendChild(grade);
        }
    }
    /**
     * Renders Dates to the DOM
     * @param {String} container - The ID of the container to render the chart to
     */
    setDates() {
        let DatesContainer = document.getElementById('DatesContainer');
        for (let i = 0; i < this.ExtractedData.length; i++) {
            let date = document.createElement('p');
            date.classList.add("nokora", "text-white", "fw-light", "m-0");
            date.innerHTML = this.ExtractedData[i][0];
            DatesContainer.appendChild(date);
        }
    }
    /**
     * Renders Bar Values to the DOM
     * @param {String} container - The ID of the container to render the chart to
     */
    setBarValues() {
        let BarStatsContainer = document.getElementById('BarStatsContainer');
        const DefaultGrade = 120;
        const tens = this.MaxValue % 100;
        const closest_hundred = tens > 50 ? (this.MaxValue - tens) + 100 : this.MaxValue - tens;

        for (let i = 0; i < this.ExtractedData.length; i++) {
            let bar = document.createElement('div');
            bar.classList.add("bg-pink", "border-top", "border-start", "border-end", "rounded-top-1");
            bar.style.height = this.ExtractedData[i][1] > 120 ? "180px":`${this.ExtractedData[i][1] * BarStatsContainer.clientHeight / 120}px`;
            bar.style.width = `25px`;
            bar.setAttribute('Matches', this.ExtractedData[i][1]);
            bar.setAttribute('ClickedOn', 'false')
            BarStatsContainer.appendChild(bar);
            this.ListenToMouseClick(bar);
        }
    }
}