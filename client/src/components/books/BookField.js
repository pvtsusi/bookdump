import CardActionArea from '@material-ui/core/CardActionArea';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField/TextField';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editBook, updateBook } from '../../reducers/books';
import themes from '../../themes';

const mapStateToProps = ({ session }) => ({
  admin: session.authenticated && session.user && session.user.admin
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      editBook,
      updateBook
    }, dispatch
  );

export class BookField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedValue: this.props.book ? this.props.book[this.props.field] : ''
    };
    this.onClick = () => this.props.editBook(this.props.field);
    this.onChange = event => this.setState({ editedValue: event.target.value });
    this.onSubmit = event => {
      event.preventDefault();
      this.props.updateBook(this.props.book, this.props.field, this.state.editedValue);
    };
  }

  render() {
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
          <input type="submit" style={{ display: 'none' }}/>
        </form>
      );
    } else if (this.props.admin) {
      return (
        <CardActionArea onClick={this.onClick}>
          {this.props.children}
        </CardActionArea>
      );
    }
    return (
      <MuiThemeProvider theme={themes.vollkorn}>
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookField);
