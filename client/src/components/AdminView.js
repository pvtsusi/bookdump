import { MuiThemeProvider } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/es/ListSubheader/ListSubheader';
import IconButton from '@material-ui/core/IconButton/IconButton';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Typography from '@material-ui/core/Typography/Typography';
import CloseIcon from '@material-ui/icons/Close';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { declineBook, getBooks } from '../reducers/books';
import themes from '../themes';
import AdminLogin from './AdminLogin';

const mapStateToProps = ({ session, books }) => ({
  admin: session.authenticated && session.user && session.user.admin,
  books: books.booksByReserver,
  error: books.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBooks,
      declineBook
    }, dispatch
  );

class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      declined: {}
    };
    this.decline = (book) => {
      this.props.declineBook(book);
      this.setState({ declined: { ...this.state.declined, [book.isbn]: true } });
    };
  }

  componentWillMount() {
    this.props.getBooks();
  }

  render() {
    if (!this.props.admin) {
      return (
        <AdminLogin history={this.props.history}/>
      );
    }
    if (this.props.error) {
      return (
        <Typography>
          Error: {this.props.error}
        </Typography>
      );
    }

    if (this.props.books && this.props.books.length === 0) {
      return (
        <Typography>
          No books
        </Typography>
      );
    }

    if (this.props.books) {
      return (
        <MuiThemeProvider theme={themes.narrow}>
          <List subheader={<li/>}>
            {
              Object.keys(this.props.books).map(reserver => {
                const reserverName = this.props.books[reserver][0].reserverName;
                return (
                  <li key={reserver}>
                    <ul style={{ listStyle: 'none' }}>
                      <ListSubheader>
                        <Typography variant="h6">
                          {reserverName}
                        </Typography>
                      </ListSubheader>
                      {
                        this.props.books[reserver]
                          .filter(book => !this.state.declined[book.isbn]).map(book => (
                          <ListItem key={book.isbn}>
                            <ListItemText inset primary={book.title} secondary={book.author}/>
                            <ListItemSecondaryAction>
                              <IconButton onClick={() => this.decline(book)} color="secondary">
                                <CloseIcon/>
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      }
                    </ul>
                  </li>
                );
              })
            }
          </List>
        </MuiThemeProvider>
      );
    }
    return null;
  }
}

AdminView.propTypes = {
  books: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({ reserverName: PropTypes.string })))
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminView);
