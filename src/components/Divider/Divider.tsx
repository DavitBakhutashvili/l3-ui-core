import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { backwardCompatibilityForProperties } from "../../helpers/backwardCompatibilityForProperties";
import { DirectionType } from "./DividerConstants";
import VibeComponentProps from "../../types/VibeComponentProps";
import "./Divider.scss";

interface DividerProps extends VibeComponentProps {
  direction?: DirectionType;
  classname?: string;
}

const Divider = ({
  // Backward compatibility for props naming
  classname,
  className = undefined,
  direction = DirectionType.HORIZONTAL
}: DividerProps) => {
  const overrideClassName = backwardCompatibilityForProperties([className, classname]);
  return <div className={cx("l3-style-divider", overrideClassName, `l3-style-divider--${direction}`)} />;
};

Divider.directions = DirectionType;

Divider.propTypes = {
  className: PropTypes.string,
  direction: PropTypes.oneOf([Divider.directions.HORIZONTAL, Divider.directions.VERTICAL])
};

export default Divider;
