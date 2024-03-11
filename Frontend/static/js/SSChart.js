async function LoadChartComponent(path) {
    const response = await fetch(path);
    if (!response.ok) {
        return await grabContent('/404.html');
    }
    const data = await response.text();
    return data;
}

class SSChart {
    /**
     * @param {Object} Data - Dictionary Containing Data to be used for the chart
     * @param {String} Title - Title Of The Chart
     * @param {String} Path - Path to the HTML file containing the chart
     */
    constructor (Data, Title, Path) {
        this.ChartData = Data;
        this.Title = Title;
        this.Component = LoadChartComponent(Path);
        this.ExtractedData = Object.entries(this.ChartData[this.Title]);
        this.MaxValue = this.findMaxValue();
        this.MinValue = this.findMinValue();

    }
    findMaxValue() {
        let max = 0;
        for (let i = 0; i < this.ExtractedData.length; i++) {
            if (this.ExtractedData[i][1] > max) {
                max = this.ExtractedData[i][1];
            }
        }
        return max;
    }
    findMinValue() {
        let min = this.MaxValue;
        for (let i = 0; i < this.ExtractedData.length; i++) {
            if (this.ExtractedData[i][1] < min) {
                min = this.ExtractedData[i][1];
            }
        }
        return min;
    }
    setChartTitle() {
        let ChartTitle = document.getElementById('ChartTitle');
        ChartTitle.innerHTML = this.Title;
    }
    setGrades() {
        let GradesContainer = document.getElementById('GradeContainer');
        for (let i = 0; i < 6; i++) {
            let grade = document.createElement('div');
            grade.classList.add("grade", "justify-content-end", "nokora", "fw-light", "m-0");
            grade.innerHTML = 100 - (20 * i);
            GradesContainer.appendChild(grade);
        }
    }
    setDates() {
        let DatesContainer = document.getElementById('DatesContainer');
        for (let i = 0; i < this.ExtractedData.length; i++) {
            let date = document.createElement('p');
            date.classList.add("nokora", "text-white", "fw-light", "m-0");
            date.innerHTML = this.ExtractedData[i][0];
            DatesContainer.appendChild(date);
        }
    }
    setBarValues() {
        let BarStatsContainer = document.getElementById('BarStatsContainer');

        for (let i = 0; i < this.ExtractedData.length; i++) {
            let bar = document.createElement('div');
            bar.classList.add("bg-pink", "border-top", "border-start", "border-end", "rounded-top-1");
            bar.style.height = this.ExtractedData[i][1] > 120 ? "180px":`${this.ExtractedData[i][1] * BarStatsContainer.clientHeight / 120}px`;
            bar.style.width = `25px`;
            BarStatsContainer.appendChild(bar);
        }
    }
}