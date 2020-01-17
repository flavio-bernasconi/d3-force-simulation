import * as d3 from 'd3'
import './style.css'

export default function chart() {
  const width = 1260
  const height = 1000

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const nodesNumber = 100
  const firstPercentual = (nodesNumber / 100) * 20
  const secondPercentual = (nodesNumber / 100) * 50
  const zero = []

  var nodes = d3.range(nodesNumber).map((n, i) => {
    var node = {}
    node.groupA = Math.floor(Math.random() * 3)
    if (i <= firstPercentual) {
      node.groupB = 0
      zero.push(node)
    } else if (i > firstPercentual && i > secondPercentual) {
      node.groupB = 1
    } else {
      node.groupB = 2
    }

    return node
  })

  console.log(nodes)

  var firstGroup = [
    { x: 50, y: 200 },
    { x: 50, y: 200 },
    { x: 50, y: 200 },
  ]
  var secondGroup = []

  var simulation = d3
    .forceSimulation(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', ticked)

  var node = svg
    .append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', d => Math.abs(d.x) / 7)

  var current = 'groupA'

  function ticked() {
    var k = this.alpha() * 0.3

    // nudge nodes to proper foci:
    if (current === 'groupA') {
      nodes.forEach((n, i) => {
        n.y += (firstGroup[n.groupA].y - n.y) * k
        n.x += (firstGroup[n.groupA].x - n.x) * k
      })
    } else {
      nodes.forEach((n, i) => {
        n.y += (secondGroup[n.groupB].y - n.y) * k
        n.x += (secondGroup[n.groupB].x - n.x) * k
      })
    }

    node
      .attr('cx', d => {
        return d.x
      })
      .attr('cy', d => {
        return d.y
      })

    if (current === 'groupA') {
      node.transition().attr('fill', '#9fbfdf')
    } else {
      node
        .transition()
        .attr('fill', d => (d.groupB === 2 ? 'blue' : d.groupB === 1 ? 'red' : '#9fbfdf'))
    }
  }

  window.onscroll = () => {
    var currentScrollPos = window.pageYOffset
    if (currentScrollPos > 300 && currentScrollPos < 1000) {
      current = 'groupB'
      secondGroup[0] = { x: currentScrollPos / 21, y: currentScrollPos / 30 }
      secondGroup[1] = { x: currentScrollPos / 6, y: currentScrollPos / 11 }
      secondGroup[2] = { x: currentScrollPos / 4, y: currentScrollPos / 52 }
      simulation.alpha(0.3)
      simulation.restart()
    } else if (currentScrollPos > 1001) {
      current = 'groupB'
      secondGroup[0] = { x: currentScrollPos / 11, y: currentScrollPos / 20 }
      secondGroup[1] = { x: currentScrollPos / 9, y: currentScrollPos / 14 }
      secondGroup[2] = { x: currentScrollPos / 33, y: currentScrollPos / 52 }
      simulation.alpha(0.3)
      simulation.restart()
    } else {
      current = 'groupA'
      simulation.alpha(0.3)
      simulation.restart()
    }
  }
}
