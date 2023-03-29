import { forwardRef, useEffect, useRef } from "react";

import useMergeRefs from "../../hooks/useMergeRefs";
import useDebounceEvent from "../../hooks/useDebounceEvent";

import { L3ComponentProps, L3Component } from "../../types";
import { NOOP } from "../../utils/function-utils";

import IconButton from "../IconButton/IconButton";
import CloseSmall from "../Icon/Icons/components/CloseSmall";
import cx from "classnames";
import styles from "./Textarea.module.scss";

interface TextareaProps extends L3ComponentProps {
  placeholder?: string;
  autoComplete?: string;
  initialValue?: string;
  value?: string;
  onChange?: (event: unknown) => void;
  onChangeCapture?: (event: unknown) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  debounceRate?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  setRef?: (node: HTMLElement) => void;
  /** Don't provide status for plain assistant text */
  validation?: { status?: "error" | "success" };
  maxLength?: number;
  trim?: boolean;
  required?: boolean;
  name?: string;
  cols?: number;
  rows?: number;
  maxLenght?: number;
  minLenght?: number;
  onInvalid: (event: unknown) => void;
  onInvalidCapture: (event: unknown) => void;
  onSelect: (event: unknown) => void;
  onSelectCapture: (event: unknown) => void;
  hint?: string;
  resize?: boolean;
  showLetterCount?: boolean;
}

const Textarea: L3Component<TextareaProps, unknown> = forwardRef(
  (
    {
      placeholder = "",
      autoComplete = "off",
      initialValue,
      value,
      onChange,
      onBlur = NOOP,
      onFocus = NOOP,
      onKeyDown = NOOP,
      onChangeCapture,
      debounceRate = 0,
      autoFocus = false,
      disabled = false,
      readonly = false,
      setRef = NOOP,
      trim = false,
      id = "textarea",
      required = false,
      name,
      cols,
      rows,
      maxLenght = 1200,
      minLenght,
      onInvalid,
      onInvalidCapture,
      onSelect,
      onSelectCapture,
      hint,
      validation = null,
      resize = false,
      showLetterCount
    },
    ref
  ) => {
    const inputRef = useRef(null);
    const {
      inputValue: textareaValue,
      onEventChanged,
      clearValue
    } = useDebounceEvent({
      delay: debounceRate,
      onChange,
      initialStateValue: value,
      trim
    });

    const mergedRef = useMergeRefs({ refs: [ref, inputRef, setRef] });
    useEffect(() => {
      if (inputRef.current && autoFocus) {
        const animationFrame = requestAnimationFrame(() => inputRef.current.focus());
        return () => cancelAnimationFrame(animationFrame);
      }
    }, [inputRef, autoFocus]);

    return (
      <div
        className={cx(styles.mainWrapper, {
          [styles.status_error]: validation && validation.status === "error",
          [styles.status_success]: validation && validation.status === "success",
          [styles.disabled]: disabled === true,
          [styles.noResize]: resize === false
        })}
      >
        {disabled ? (
          <div>Disabled</div>
        ) : (
          showLetterCount && (
            <label htmlFor={id} className={styles.labelTop}>
              {textareaValue ? textareaValue.length : 0}/{maxLenght}
            </label>
          )
        )}

        {textareaValue && (
          <div className={styles.clearIcon}>
            <IconButton
              size={"xxs"}
              ariaLabel="Remove"
              hideTooltip
              icon={CloseSmall}
              onClick={clearValue}
              kind={IconButton.kinds.SECONDARY}
            />
          </div>
        )}
        <textarea
          ref={mergedRef}
          id={id}
          className={styles.textarea}
          value={textareaValue}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          defaultValue={initialValue}
          cols={cols}
          rows={rows}
          disabled={disabled}
          maxLength={maxLenght}
          minLength={minLenght}
          name={name}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          onChange={onEventChanged}
          onChangeCapture={onChangeCapture}
          onInvalid={onInvalid}
          onInvalidCapture={onInvalidCapture}
          onSelect={onSelect}
          onSelectCapture={onSelectCapture}
          readOnly={readonly}
          required={required}
        />
        {hint && <div className={styles.hint}>{hint}</div>}
      </div>
    );
  }
);

export default Textarea;
