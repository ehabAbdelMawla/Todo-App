import React, { Component } from 'react'
import Chart from 'react-google-charts'
import Circular from './circular'
import Firebase from 'firebase'
import { connect } from 'react-redux'
import aes256 from 'aes256'
import store from '../index.js';
import App from './App'
class LineChart extends Component {

    state = {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth() + 1,
        years: null,
        data: {},
        keys: {}
    }
    componentWillMount = () => {
        this.setState({
            years: this.props.lineChartData.years,
            data: this.props.lineChartData.finalData,
            keys: this.props.lineChartData.keys
        })
    }




    setCurrentYear = (e) => {
        var currentMonth;
        if (this.state.years[e.target.value]) {
            currentMonth = Object.keys(this.state.years[e.target.value])[0]
        }
        this.setState({
            currentYear: e.target.value,
            currentMonth: currentMonth ? currentMonth : this.state.currentMonth
        })
    }
    setCurrentMonth = (e) => {
        this.setState({
            currentMonth: e.target.value
        })
    }
    render() {
        if (!this.state.years) {
            return ''
        }

        var GraphRoot = [""]
        Object.keys(this.props.lineChartData.keys).forEach(item => GraphRoot.push(this.props.lineChartData.keys[item]))
        var data = [GraphRoot]
        var allData = this.props.lineChartData.data
        var days = Object.keys(allData);
        if (this.state.currentMonth != "All" && this.state.currentYear != "All") {

            days.forEach(day => {
                var dateObjOfDay = new Date(day)
                if (dateObjOfDay.getMonth() + 1 == this.state.currentMonth && dateObjOfDay.getFullYear() == this.state.currentYear) {
                    // data.push([day + "", allData[day].complete])
                    var cuArr = [day + ""]
                    Object.keys(this.state.keys).forEach(id => allData[day][id] ? cuArr.push(allData[day][id].val) : cuArr.push(0))
                    data.push(cuArr)
                }
            })
        }
        else if (this.state.currentYear != "All") {
            // Month is All
            days.forEach(day => {
                var dateObjOfDay = new Date(day)
                if (dateObjOfDay.getFullYear() == this.state.currentYear) {
                    var prevItem = data.filter(item => item[0] == (dateObjOfDay.getMonth() + 1) + "")[0]
                    if (prevItem) {
                        // prevItem[1] += allData[day].complete
                        for (var i = 0; i < Object.keys(this.state.keys).length; i++) {
                            prevItem[i + 1] += allData[day][Object.keys(this.state.keys)[i]] ? allData[day][Object.keys(this.state.keys)[i]].val : 0
                        }
                    }
                    else {
                        var cuArr = [(dateObjOfDay.getMonth() + 1) + ""]
                        Object.keys(this.state.keys).forEach(id => allData[day][id] ? cuArr.push(allData[day][id].val) : cuArr.push(0))
                        data.push(cuArr)
                        // data.push([(dateObjOfDay.getMonth() + 1) + "", allData[day].complete])
                    }

                }
            })

        }
        else if (this.state.currentMonth != "All") {
            // Year is All
            days.forEach(day => {
                var dateObjOfDay = new Date(day)
                if ((dateObjOfDay.getMonth() + 1) == this.state.currentMonth) {
                    var prevItem = data.filter(item => item[0] == dateObjOfDay.getFullYear() + "")[0]
                    if (prevItem) {
                        // prevItem[1] += allData[day].complete
                        for (var i = 0; i < Object.keys(this.state.keys).length; i++) {
                            prevItem[i + 1] += allData[day][Object.keys(this.state.keys)[i]] ? allData[day][Object.keys(this.state.keys)[i]].val : 0
                        }
                    }
                    else {
                        var cuArr = [dateObjOfDay.getFullYear() + ""]
                        Object.keys(this.state.keys).forEach(id => allData[day][id] ? cuArr.push(allData[day][id].val) : cuArr.push(0))
                        data.push(cuArr)
                        // data.push([dateObjOfDay.getFullYear() + "", allData[day].complete])
                    }

                }
            })

        }
        else {
            // Year is All & Month is All
            days.forEach(day => {
                var dateObjOfDay = new Date(day)
                var prevItem = data.filter(item => item[0] == (dateObjOfDay.getFullYear()) + "")[0]
                if (prevItem) {
                    // prevItem[1] += allData[day].complete
                    for (var i = 0; i < Object.keys(this.state.keys).length; i++) {
                        prevItem[i + 1] += allData[day][Object.keys(this.state.keys)[i]] ? allData[day][Object.keys(this.state.keys)[i]].val : 0
                    }
                }
                else {
                    var cuArr = [dateObjOfDay.getFullYear() + ""]
                    Object.keys(this.state.keys).forEach(item => allData[day][item] ? cuArr.push(allData[day][item].val) : cuArr.push(0))
                    data.push(cuArr)

                }
            })

        }
        data = data.sort()

        var options;
        if (this.state.years[this.state.currentYear]) {
            var monthesOfCurrentYear = this.state.years[this.state.currentYear]
            options = Object.keys(monthesOfCurrentYear).map(month => {
                return (<option value={month} key={month}>{month}</option>)
            })
        }
        else {
            var monthesOfCurrentYear = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            options = monthesOfCurrentYear.map(month => {
                return (<option value={month} key={month}>{month}</option>)
            })
        }
        const ssss = {
            // curveType: "function",
            legend: { position: "top" },
            hAxis: {
                title: 'Duration',
            },
            vAxis: {
                title: 'Complete',
            },
        };
        return (
            <section>
                <article>
                    <p>Year</p>
                    <select className="browser-default" id="years" value={this.state.currentYear} onChange={this.setCurrentYear}>
                        {Object.keys(this.state.years).map(year => {
                            return (<option value={year} key={year} >{year}</option>)
                        })}
                        {Object.keys(this.state.years).length > 1 ? <option value="All" key="all">All</option> : ''}
                    </select>
                </article>
                <article>
                    <p>Month</p>
                    <select className="browser-default" id="monthes" value={this.state.currentMonth} onChange={this.setCurrentMonth}>
                        {options}
                        {options ? options.length > 1 ? <option value="All" key="all">All</option> : '' : ''}
                    </select>
                </article>

                <Chart
                    // width={'1200px'}
                    height={'500px'}
                    chartType="LineChart"
                    loader={<Circular />}
                    data={data}
                    options={ssss}
                    rootProps={{ 'data-testid': (Object.keys(this.state.keys).length) + "" }}
                />
            </section>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.currentUser,
        lineChartData: state.lineChartData
    }
}

export default connect(mapStateToProps)(LineChart)