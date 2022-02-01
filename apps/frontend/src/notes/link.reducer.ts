function linkReducer(state = { value: 0 }, action) {
  switch (action.type) {
    case 'link/save':
      return { value: state.value + 1 };

    default:
      return state;
  }
}

export default linkReducer;
