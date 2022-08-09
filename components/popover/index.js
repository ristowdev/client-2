import React from 'react'
import TooltipTrigger from 'react-popper-tooltip'

const modifiers = [
  {
    name: 'offset',
    enabled: true,
    options: {
      offset: [0, 4],
    },
  },
]

const Trigger = (children) => (
  {
    triggerRef,
    getTriggerProps,
  }
) => (
  <span
    {...getTriggerProps({
      ref: triggerRef,
    })}
  >
    {children}
  </span>
)

const Tooltip = (tooltip, hideArrow) => (
  {
    arrowRef,
    tooltipRef,
    getArrowProps,
    getTooltipProps,
    placement,
  }
) => (
  <div
    {...getTooltipProps({
      className: 'tooltip-container left-2 mt-1',
      ref: tooltipRef,
    })}
  >
    {!hideArrow && (
      <div
        {...getArrowProps({
          className: 'tooltip-arrow',
          'data-placement': placement,
          ref: arrowRef,
        })}
      />
    )}
    {tooltip}
  </div>
)

const Popover = React.memo(({ tooltip, children, hideArrow, ...props }) => (
  <TooltipTrigger
    {...props}
    modifiers={modifiers}
    tooltip={Tooltip(tooltip, hideArrow)}
    placement="bottom"
  >
    {Trigger(children)}
  </TooltipTrigger>
))

export default Popover

export class StateContainer extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      on: false,
    }
  }

  render() {
    return this.props.children({
      on: this.state.on,
      set: this.set,
      toggle: this.toggle,
    })
  }

  set = (on) => this.setState({ on })
  toggle = () => this.setState((prevState) => ({ on: !prevState.on }))
}