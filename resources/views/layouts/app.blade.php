<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,700;0,800;1,500&display=swap" rel="stylesheet">

    <link rel="shortcut icon" href="/images/favicon.png" type="image">
  
    <script type="text/javascript">
        // Fix for Firefox autofocus CSS bug
        // See: http://stackoverflow.com/questions/18943276/html-5-autofocus-messes-up-css-loading/18945951#18945951
    </script>
    <script type="text/javascript" src={{ asset('js/app.js') }} defer>
</script>
  </head>
  <body>
    <main>
      <header>
        
        @if (Auth::check())
        <div class="navbar">
          <a href="{{ url('/') }}"><img src="/images/horizontal-logo.png" alt=""></a>
          <div class="navbar-options">
            <div class="navbar-collapse-item">
              <a >{{ Auth::user()->name }}</a>
              <div class = "profilePhotoCropper" id ="navbarPhotoCropper">
                  @if(empty(Auth::user()->profile_image))
                    <img src = "/images/avatars/profile-pic-2.png" id = "navbarProfilePhoto">
                  @else
                    <img src ="{{Auth::user()->profile_image}}" id = "navbarProfilePhoto"> 
                  @endif
              </div>
            </div>
          </div>
        </div>
        <div class="navbar-collapse">
          <a href="{{ url('/userpage') }}"><div>Profile</div></a>
          <a href="{{ url('/logout') }}"><div>Logout</div></a>
        </div>

        @elseif(Auth::guard('admin')->check())
        <div class ="navbar">
            Hello I'm Here
        </div>
        @else
        <div class="navbar">
          <a href="{{ url('/') }}"><img src="/images/horizontal-logo.png" alt=""></a>
          <div class="navbar-options">
            <a href="">About Us</a>
            <a href="">FAQ</a>
            <div class = "collapsible" onclick= "adminCollapse('loginContent')" >
              Login
            </div>
            <div class = "collapsible" onclick= "adminCollapse('registerContent')" >
              Sign Up
            </div>
          </div>
        </div>
        @endif
      </header>
      <div id="filler"></div>
      <section id="content">
        <div class = "navbar-collapse adminOptions" id = "loginContent">
          <div class = "adminItem">
            <a href="{{ url('/login') }}"> Login to your Personal Account</a> 
          </div>
          <hr class = "hrAdmin"> </hr>
          <div class = "adminItem">
            <a href="{{ url('/adminLogin') }}"> Login to your Company Account</a> 
          </div>
        </div>
        <div class = "navbar-collapse adminOptions" id = "registerContent">
          <div class = "adminItem">
            <a href="{{ url('/register') }}"> Create Personal Account</a> 
          </div>
          <hr class = "hrAdmin"> </hr>
          <div class = "adminItem">
             <a href="{{ url('/register/admin') }}"> Create Company's Account</a>  
          </div>
        </div>
        @yield('content')
      </section>
    </main>
  </body>
</html>
