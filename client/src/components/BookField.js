import React from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import CardActionArea from '@material-ui/core/es/CardActionArea/CardActionArea';
import {editBook, updateBook} from "../reducers/books";
import {bindActionCreators} from 'redux';
import connect from 'react-redux/es/connect/connect';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      editBook,
      updateBook
    }, dispatch
  );


class BookField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedValue: this.props.book ? this.props.book[this.props.field] : ''
    };
    this.onClick = () => this.props.editBook(this.props.field);
    this.onChange = event => this.setState({...this.state, editedValue: event.target.value});
    this.onSubmit = event => {
      event.preventDefault();
      this.props.updateBook(this.props.book, this.props.field, this.state.editedValue);
    };
  }
  render () {
    if (this.props.editing) {
      return (
        <form onSubmit={this.onSubmit} noValidate autoComplete="off">
          <TextField
            fullWidth
            autoFocus
            onChange={this.onChange}
            id="title-input"
            helperText={this.props.book ? this.props.book[this.props.field] : ''}
          />
          <input type="submit" style={{display: 'none'}} />
        </form>
      );
    }
    return (
      <CardActionArea onClick={this.onClick}>
        {this.props.children}
      </CardActionArea>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(BookField);
