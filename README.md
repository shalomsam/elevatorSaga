# elevator-saga
[Elevator Saga](http://play.elevatorsaga.com) solutions for v1.6.5

Currently works upto challenge #9!

Implementation
--------------
There are global queues for up button press and down button press. When an elevator is idle it picks up from the relevant up queue or down queue based on its current position.
Each elevator also normally traverses to a floor when a floor button is pressed from within an elevator, like normal elevators do. When traversing through floors there is also a check to see if the passing floor is present in the relevant directional queue and can be handle immediately.

Also has colored console logs for debugging.


Author
------

#### Shalom Sam
+ Checkout my <a href="https://shalomsam.com" title="Full Stack Web Developer, UI/UX Javascript Specialist" target="_blank">Full Stack Web Developer Website</a>
+ You can checkout this <a href="http://react.shalomsam.com" title="Full Stack Developer, Angular Portfolio" target="_blank">React Portfolio here</a>
+ A scope of my work @ <a title="Web Software Developer Portfolio" target="_blank" href="https://react.shalomsam.com/portfolio">React Portfolio</a>
