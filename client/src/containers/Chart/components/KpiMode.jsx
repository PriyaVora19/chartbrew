import React from "react";
import PropTypes from "prop-types";
import {
  Progress, Spacer, Tooltip,
} from "@nextui-org/react";
import { ChevronDownCircle, ChevronUpCircle } from "react-iconly";

import determineType from "../../../modules/determineType";
import { negative, positive } from "../../../config/colors";
import Container from "../../../components/Container";
import Row from "../../../components/Row";
import Text from "../../../components/Text";

function KpiMode(props) {
  const { chart } = props;

  const _getKpi = (data) => {
    let finalData;
    if (data && Array.isArray(data)) {
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i]
          && (determineType(data[i]) !== "array" || determineType(data[i]) !== "object")
        ) {
          finalData = data[i];
          break;
        }
      }

      if (!finalData) {
        finalData = `${data[data.length - 1]}`;
      }
    }

    if (`${parseFloat(finalData)}` === `${finalData}`) {
      return parseFloat(finalData).toLocaleString();
    }

    return `${finalData}`;
  };

  const _renderGrowth = (c) => {
    if (!c) return (<span />);
    const { status, comparison } = c;
    return (
      <div>
        <Tooltip content={`compared to last ${chart.timeInterval}`}>
          <Container className={"w-full"}>
            {status === "neutral" && (
              <Text b className={"text-gray-500"}>{`${comparison}%`}</Text>
            )}
            {status === "negative" && (
              <Row align="center">
                <ChevronDownCircle size="small" primaryColor={negative} />
                <Spacer x={0.5} />
                <Text b className={"text-danger-300"}>{` ${comparison}%`}</Text>
              </Row>
            )}
            {status === "positive" && (
              <Row align="center">
                <ChevronUpCircle size="small" primaryColor={positive} />
                <Text b className={"text-success-300"}>{` ${comparison}%`}</Text>
              </Row>
            )}
          </Container>
        </Tooltip>
      </div>
    );
  };

  const _renderGoal = (goals, index) => {
    const goal = goals.find((g) => g.goalIndex === index);
    const color = chart.Datasets[index] && chart.Datasets[index].datasetColor;
    if (!goal) return (<span />);
    const {
      max, value, formattedMax,
    } = goal;
    if ((!max && max !== 0) || (!value && value !== 0)) return (<span />);

    return (
      <div style={{ width: "100%", paddingTop: 20 }}>
        <Progress
          value={value}
          maxValue={max}
          size="sm"
          css={{
            "& .nextui-progress-bar": {
              background: color
            }
          }}
        />
        <Row justify="space-between">
          <Text size="sm">{`${((value / max) * 100).toFixed()}%`}</Text>
          <Text size="sm">{formattedMax}</Text>
        </Row>
      </div>
    );
  };

  return (
    <Container
      className={"pl-0 pr-0 h-[300px] items-center align-middle justify-center"}
    >
      <Row wrap="wrap" justify="space-around" align="center" className={"h-full"}>
        {chart.chartData.data.datasets.map((dataset, index) => (
          <div key={dataset.label} style={{ padding: 10 }}>
            <Row justify="center" align="center">
              <Text
                b
                size={chart.chartSize === 1 ? "text-3xl" : "text-4xl"}
                key={dataset.label}
              >
                {dataset.data && _getKpi(dataset.data)}
              </Text>
            </Row>

            {chart.Datasets[index] && (
              <Row justify="center" align="center">
                <Text className={`mt-${chart.showGrowth ? "[-5px]" : 0} text-center`}>
                  {chart.showGrowth && chart.chartData.growth && (
                    _renderGrowth(chart.chartData.growth[index])
                  )}
                  <span
                    style={
                        chart.Datasets
                        && styles.datasetLabelColor(chart.Datasets[index].datasetColor)
                      }
                    >
                    {dataset.label}
                  </span>
                </Text>
              </Row>
            )}

            {chart.chartData.goals && (
              <Row justify="center" align="center">
                {_renderGoal(chart.chartData.goals, index)}
              </Row>
            )}
          </div>
        ))}
      </Row>
    </Container>
  );
}

const styles = {
  kpiContainer: {
    height: 300, display: "flex", justifyContent: "center", alignItems: "center"
  },
  kpiItem: (size, items, index) => ({
    fontSize: size === 1 ? "2.5em" : "4em",
    textAlign: "center",
    margin: 0,
    marginBottom: size === 1 && index < items - 1 ? (50 - items * 10) : 0,
    marginRight: index < items - 1 && size > 1 ? (40 * size) - (items * 8) : 0,
  }),
  datasetLabelColor: (color) => ({
    borderBottom: `solid 3px ${color}`,
  }),
};

KpiMode.propTypes = {
  chart: PropTypes.object.isRequired,
};

export default KpiMode;