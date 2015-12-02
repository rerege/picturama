import React from 'react';
import TagsInput from 'react-tagsinput'

import TagActions from './../actions/tag-actions';

class AddTags extends React.Component {

  constructor(props) {
    super(props);

    this.state = { tags: [] };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log('modal');
  }

  handleChange(tags) {
    let state = this.state;
    state.tags = tags;
    this.setState(state);
  }

  handleSubmit(e) {
    console.log('handle submit');
    e.preventDefault();

    var tags = this.state.tags.map((tag) => tag.trim());
    TagActions.createTags(tags);
  }

  render() {
    var btnClass = `button button--raised button--colored`;

    return (
      <div className="outer-modal">
        <div className="modal shadow--2dp">
          <form onSubmit={this.handleSubmit}>
            <h3>Add a tag</h3>

            <div className="textfield">
              <TagsInput
                id="tags"
                value={this.state.tags}
                onChange={this.handleChange} />
            </div>

            <button className={btnClass}>Add</button>
          </form>
        </div>
      </div>
    );
  }

}

export default AddTags;