import React, { FC, ReactElement, useCallback, useEffect, useMemo, useRef } from "react";
import cx from "classnames";
import { CSSTransition } from "react-transition-group";
import Button from "../../components/Button/Button";
import Avatar from "../../components/Avatar/Avatar";
import Icon, { IconSubComponentProps } from "../../components/Icon/Icon";
import CloseGray from "../Icon/Icons/components/CloseGray";
import CloseWhite from "../Icon/Icons/components/CloseWhite";
import ToastButton from "./ToastButton/ToastButton";
import { ToastAction, ToastActionType, ToastType, ToastIconSize, ToastPosition } from "./ToastConstants";
import { getIcon } from "./ToastHelpers";
import L3ComponentProps from "../../types/L3ComponentProps";
import { NOOP } from "../../utils/function-utils";
import "./Toast.scss";
import { ArtWork } from "./ToastArtWork/ToastArtWork";
interface ToastProps extends L3ComponentProps {
  actions?: ToastAction[];
  /** If true, Toast is open (visible) */
  open?: boolean;
  type?: ToastType;
  /** Possible to override the default icon */
  icon?: string | React.FC<IconSubComponentProps> | null;
  /** If true, won't show the icon */
  hideIcon?: boolean;
  /** The action to display */
  action?: JSX.Element;
  /** If false, won't show the close button */
  closeable?: boolean;
  position?: ToastPosition;
  onClose?: () => void;
  /** The number of milliseconds to wait before
   * automatically closing the Toast
   * (0 or null cancels this behaviour) */
  autoHideDuration?: number;
  children?: ReactElement | ReactElement[] | string | boolean;
  label?: string;
  paragraph?: string;
  iconSize?: "SMALL" | "MEDIUM" | "LARGE";
  artWork?: string;
  artWorkType?: "img" | "icon";
  avatar?: boolean;
  avatarType?: "IMG" | "ICON" | "TEXT";
  avatarSize?: "SMALL" | "MEDIUM" | "LARGE";
  avatarBorder?: boolean;
  avatarSrc?: string;
  avatarIcon?: string;
  avatarText?: string;
  avatarAriaLabel?: string;
  avatarRole?: string;
  avatarBackgroundColor?: string;
  avatarTextClassName?: string;
  avatarRectangle?: boolean;
  avatarSquare?: boolean;
  avatarDisabled?: boolean;
  avatarClassName?: string;
  avatarId?: string;
  avatarDataTestId?: string;
}

const Toast: FC<ToastProps> & {
  types?: typeof ToastType;
  actionTypes?: typeof ToastActionType;
  positions?: typeof ToastPosition;
} = ({
  open = true,
  autoHideDuration = null,
  type = ToastType.POSITIVE,
  position,
  icon,
  hideIcon = false,
  action: deprecatedAction,
  actions,
  children,
  iconSize = "LARGE",
  closeable = true,
  artWork,
  avatar,
  onClose = NOOP,
  className,
  label = "Label",
  paragraph = "Paragraph",
  avatarType,
  avatarSize,
  avatarSrc,
  avatarIcon,
  avatarText,
  avatarAriaLabel,
  avatarRole,
  avatarBorder,
  avatarTextClassName,
  avatarBackgroundColor,
  avatarRectangle,
  avatarSquare,
  avatarDisabled,
  avatarClassName,
  avatarId,
  avatarDataTestId
}) => {
  const toastButtons: JSX.Element[] | null = useMemo(() => {
    return actions
      ? actions
          .filter(action => action.type === ToastActionType.BUTTON)
          .map(({ type: _type, content, ...otherProps }, index) => (
            <ToastButton key={`alert-button-${index}`} {...otherProps}>
              {content}
            </ToastButton>
          ))
      : null;
  }, [actions]);

  const classNames = useMemo(
    () => cx("l3-style-toast", `l3-style-toast--position-${position}`, `l3-style-toast--type-${type}`, className),
    [type, className, position]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  /* Timer */
  const timerAutoHide = useRef<NodeJS.Timeout>();
  const setAutoHideTimer = useCallback(
    (duration: number) => {
      if (!onClose || duration == null) {
        return;
      }

      clearTimeout(timerAutoHide.current);
      timerAutoHide.current = setTimeout(() => {
        handleClose();
      }, duration);
    },
    [handleClose, onClose]
  );

  useEffect(() => {
    if (open && autoHideDuration > 0) {
      setAutoHideTimer(autoHideDuration);
    }

    return () => {
      clearTimeout(timerAutoHide.current);
    };
  }, [open, autoHideDuration, setAutoHideTimer]);

  const iconElement = !hideIcon && getIcon(type, icon, ToastIconSize[iconSize]);

  return (
    <CSSTransition in={open} classNames="l3-style-toast-animation" timeout={400} unmountOnExit>
      <div className="l3-style-toast--position">
        <>
          <div className={classNames} role="alert" aria-live="polite">
            {avatar && (
              <div className="l3-style-toast-avatar">
                <Avatar
                  type={Avatar.types[avatarType]}
                  size={Avatar.sizes[avatarSize]}
                  src={avatarSrc}
                  icon={avatarIcon}
                  text={avatarText}
                  ariaLabel={avatarAriaLabel}
                  role={avatarRole}
                  rectangle={avatarRectangle}
                  square={avatarSquare}
                  isDisabled={avatarDisabled}
                  withoutBorder={avatarBorder}
                  textClassName={avatarTextClassName}
                  backgroundColor={avatarBackgroundColor}
                  className={avatarClassName}
                  id={avatarId}
                  data-testid={avatarDataTestId}
                />
              </div>
            )}
            {(!artWork || !avatar) && iconSize && <div className="l3-style-toast-icon-large">{iconElement}</div>}
            {artWork && (
              <div className="l3-style-toast-artwork">
                {" "}
                <ArtWork type={ArtWork.types.IMG} src={artWork} ariaLabel="label" />{" "}
              </div>
            )}
            <div
              className={cx("l3-style-toast-content", {
                "l3-style-toast-content-no-icon": !iconElement
              })}
            >
              <>
                <div className="l3-style-toast-label">{label || children}</div>
                <div className="l3-style-toast-paragraph">{paragraph}</div>
              </>
            </div>
            {(toastButtons || deprecatedAction) && (
              <div className="l3-style-toast-action">{toastButtons || deprecatedAction}</div>
            )}
            {closeable && (
              <Button
                className="l3-style-toast_close-button"
                onClick={handleClose}
                size={Button.sizes.SMALL}
                kind={Button.kinds.TERTIARY}
                color={Button.colors.ON_PRIMARY_COLOR}
                ariaLabel="close-toast"
              >
                <Icon
                  iconType={Icon.type.SVG}
                  clickable={false}
                  icon={type === ToastType.NORMAL ? CloseWhite : CloseGray}
                  ignoreFocusStyle
                />
              </Button>
            )}
          </div>
        </>
      </div>
    </CSSTransition>
  );
};

Object.assign(Toast, {
  types: ToastType,
  actionTypes: ToastActionType
});

export default Toast;
