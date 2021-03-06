const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')


const data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB() {
    Campground.remove({}, err => {
        if (err) {
            console.log('ERROR occurred while trying to wipe the db!')
        } else {
            console.log('Db successfully cleared of Campgrounds!')

            data.forEach(seed => {
                Campground.create(seed, (err, camp) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('Added campground to db...')

                        Comment.create(
                            {
                                text: 'This place is great, but I wish I had internet',
                                author: 'Homer'
                            }, (err, comm) => {
                                if (err) {
                                    console.log('ERROR occurred while trying to add comment.')
                                } else {
                                    camp.comments.push(comm)
                                    camp.save()
                                    console.log('Added new comment...')
                                }
                            }
                        )
                    }
                })
            })
        }
    })

}

module.exports = seedDB